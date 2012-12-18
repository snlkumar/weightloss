class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:show, :create, :next, :bmi_update, :weight_update, :step_two]
  before_filter :set_defaults,       :only => [:step_two, :edit, :personal_info]
  
  layout 'signup', :only => [:create, :step_two, :finalize]
  layout 'user_settings', :only => [:update, :account_info, :personal_info, :nutrition_info, :exercise_info, :measurement,:newmeasurement, :bodyfatpercent]
  
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
    bodyfat
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
	#new added actions
=begin
  def bodyfat_store
  	@bodyfat=Bodyfat.create(:bodyfat=>params[:bodyfat],:height=>params[:height].to_f,:waist=>params[:waist].to_f,:neck=>params[:neck].to_f,:hips=>params[:hips].to_f,:user_id=>current_user.id)
  	if @bodyfat.save
  		@status="saved"
  	else
  		@status="not"
  	end
  	render :text=>@status

	if params[:hips]=="" || params[:hips]==nil
  		params[:hips]=0
  	end	
	if current_user.gender.downcase=="male"
		#body fat calculator formula for man
		bodyfat=495/(1.0324-0.19077*(Math.log(params[:waist].to_f-params[:neck].to_f))+0.15456*(Math.log(params[:height].to_f)))-450
	else
		#body fat calculator formula for woman:
		bodyfat=495/(1.29579-0.35004*(Math.log(params[:waist].to_f+params[:hips].to_f-params[:neck].to_f))+0.22100*(Math.log(params[:height].to_f)))-450 
	end
 
 	#@bodyfat=Bodyfat.create(:bodyfat=>bodyfat,:height=>params[:height].to_f,:waist=>params[:waist].to_f,:neck=>params[:neck].to_f,:hips=>params[:hips].to_f,:user_id=>current_user.id)
 

end

=end
############################### new code
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
end
