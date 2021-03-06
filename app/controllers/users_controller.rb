class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:show, :create, :next, :bmi_update, :weight_update, :step_two,:bodyfatpercent]
  before_filter :set_defaults,       :only => [:step_two, :edit, :personal_info]
  
  layout 'signup', :only => [:create, :step_two, :finalize]
  layout 'user_settings', :only => [:update, :account_info, :personal_info, :nutrition_info, :exercise_info, :measurement,:newmeasurement, :bodyfatpercent, :notificationnew , :notificationDetail, :notifications]
  
  def show

    @user = User.find(params[:id]) || current_user
	
    if @user.nil?
      redirect_to(root_path) and return
    end
    
    if current_user == @user
      render :layout => "profile"
    elsif @user.private?
      render :action => :private, :layout => "private_profile"
    elsif @user.public?
      render :action => :public_profile, :layout => "public_profile"
    else
      render :action => :private, :layout => "private_profile"
    end
    
    rescue ActiveRecord::RecordNotFound
      redirect_to(root_path)
  end
  
  def step_two
    @slider_height = 60
    @slider_weight = 150
    render :layout => 'signup'
  end
  
  def finalize
    if current_user.update_attributes(params[:user])
      current_user.update_attribute(:status, 'finalize')
      current_user.save # TODO: needed?
      redirect_to edit_metabolic_rates_path
    else
      @slider_height = current_user.height || 60
      @slider_weight = current_user.weight || 150
      render :action => :step_two, :layout => 'signup'
    end
  end
  
  def next
    
  end
  
  def update
    @user = current_user # makes our views "cleaner" and more consistent
    
    if @user.update_attributes(params[:user])
      flash[:notice] = 'Update successful'
      
      case request.referrer
      when /info/
        redirect_to user_edit_personal_info_path(current_user)
      when /nutrition/
        redirect_to user_edit_nutrition_info_path(current_user)
      when /exercise/
        redirect_to user_edit_exercise_info_path(current_user)
      when /account/
        redirect_to user_edit_account_info_path(current_user)
      else
        redirect_to user_edit_account_info_path(current_user)
      end
    else
      case request.referrer
      when /info/
        render :action => :personal_info
      when /nutrition/
        render :action => :nutrition_info
      when /exercise/
        render :action => :exercise_info
      when /account/
        render :action => :account_info
      else
        render :action => :account_info
      end
    end
    
  end
  
  def account_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def personal_info  
    @user = current_user
 	 @photo= Photo.new
    render :layout => 'user_settings'
  end
  
  def nutrition_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def exercise_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def bmibodyfat
    @user = current_user
    render :layout => "profile"
  end
  
  def weight_update
    current_user.update_attributes(params[:user])
   render :text => current_user.weight	
  end
  
  def bmi_update
    @user = User.find(params[:id])
    @user.update_attributes(params[:user])
    head(200)
  end
  
  def achievement_date
    render :partial => 'shared/achievement_date', :locals => {:user => current_user}
  end
  
  
  
###############################################################################	



	def bodyfatpercent
	@user=current_user
	@fat=Bodyfat.new

	end

	def  bodyfatcalculate
	@user=current_user
	@fat=@user.bodyfats.create(params[:bodyfat])
	if @fat.save
        redirect_to(bodyfat_over_time_tracking_path, :notice => 'Bodyfat successfully saved.')
	else
	   render "bodyfatpercent"
    end
	end
############################### new code end


	def measurement 
    @user = current_user
    @meas=Measurement.new
   end

  
  def newmeasurement
  @user=current_user
  @meas=@user.measurements.create(params[:measurement])
    if @meas.save
        redirect_to(measurement_over_time_tracking_path, :notice => 'measurement was successfully saved.')
	else
	   render "measurement"
    end
  end
  
#########################################################

	def notifications
=begin
    @user =current_user
    if @user.mywwnotification.nil?
    	Mywwnotification.create(:weight=>1,:activity=>1,:food=>1,:supplements=>1, :bodyfat=>1, :calories=>1, :other=>1, :user_id=>current_user.id)
    	redirect_to(user_path)
    else
    
    #@notifications=Notification.where("notificationable_type='Vendor' and notificationTo='User' and notificationToId='#{@user.id}' and hideNotification=0")
	# @MywwNotifications=Notification.where("notificationable_type='Admin' and notificationTo='User' ")
	
	@notification=@user.mywwnotification
   render :layout => "user_settings"
   end
=end

    @notifications=Notification.where("notificationable_type='User' and notificationable_id='#{current_user.id}'").page(params[:page] || 1).per(50).order('created_at ASC')   
  
  
end  


  ##############################################################


	def notificationnew
    @notification=Notification.new   
	end
	
	
   ##############################################################


	def deleteNotification
	  @notification=Notification.find(params[:id])
	  @notification.destroy
     redirect_to(user_path(current_user), :notice => 'notification was successfully deleted.')	  
	end

		
		
	#############################################################
	
	def notificationDetail
	  @notification=Notification.find(params[:id])
	end	
		

	##############################################################
	
	
	def notificationcreate
	
		if params[:notificationFrequency]=="first"
		
		  if params[:notificationFrequency1].to_s=="day"
	       params[:notification][:notificationFrequency]="#{(24/params[:times].to_f).round(2)}"+".hours"
		  elsif params[:notificationFrequency1].to_s=="week"
			 params[:notification][:notificationFrequency]="#{24*7/params[:times].to_f}"+".hours"				
		  elsif params[:notificationFrequency1].to_s=="month"
			 params[:notification][:notificationFrequency]="#{24*30/params[:times].to_f}"+".hours"
		  else
			 params[:notification][:notificationFrequency]="#{(24*30*12/params[:times].to_f).round(2)}"+".hours"
		  end
		  
           params[:notification][:frequency_type]="first"				 	
		else

           params[:notification][:notificationFrequency]=params[:notificationFrequency2].split(",").sort.collect{|a| a.to_s.strip+".days" }.join(",").to_s
		     params[:notification][:frequency_type]="second"
		end
		
		if params[:notification][:notification_type]=="food"
	     params[:notification][:mealslist]=params[:meals1].collect{|a| a.split(",") }.join(",").to_s
		end			


		if params[:notification][:notification_type]=="food_type"
	     params[:notification][:food_category]=params[:food_category].collect{|a| a.split(",") }.join(",").to_s	    
		end	
	
		if params[:notification][:notification_type]=="activity"
		  params[:notification][:exerciseslist]=params[:exercise1].collect{|a| a.split(",") }.join(",").to_s	
		  params[:notification][:workoutduration]=params[:workoutduration]				
		end

		if params[:notificationPeriodUnit]=="days"
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.days.from_now		
		elsif params[:notificationPeriodUnit]=="weeks"
	   	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.weeks.from_now		
		elsif params[:notificationPeriodUnit]=="months"
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.months.from_now		
		else
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.years.from_now		
		end
		
		 	
       @notification = Notification.create(params[:notification])
   	 #@emails=User.select(:email)
    	 if @notification.save
  
#writing schedule and rake task file
	
		Notification.updateCronTab         
      redirect_to(user_path, :notice => 'Notification was successfully created.')
    else
      render :action => "notifications"
    end
	
	
	end

   ###########################################################3 

 def memberships
 
	@user =current_user
 	 @memberships=@user.vendormembers.all( :conditions=>['status=? or status=?',"waiting","accepted" ])
 	 	 @vendorRatings=Rating.where("ratingFor='user' and ratingForid='#{@user.id}'") 

			if  @vendorRatings.blank?
			  @averageRating=0
		    else
		      total=0
					@vendorRatings.each do |d|					
					total+=d.rating
			      end
		        @averageRating=total/@vendorRatings.length
			end
      render :layout => "user_settings"
 end
 
 ####################################################################3
 
 def addmembership
  	@user=current_user
	@vendormember=Vendormember.find(params[:row])
	@vendormember.update_attributes(:userApproved=>params[:userApproved],:status=>params[:status])
	if params[:status]=="rejected"
	@vendormember.destroy
	end	
	render :text=>"sucessfully "+params[:status].to_s
 end 
 
############################################################################


 def hidenotification
  @notification=Notification.find(params[:id])
  @notification.update_attributes(:hideNotification=>true)
  render :text=>"Sucessfully removed"
 end 
	
###################################################################



end
