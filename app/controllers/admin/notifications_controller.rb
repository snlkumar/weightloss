class Admin::NotificationsController < ApplicationController
 layout 'new_admin'
  
  def index
        @notifications = Notification.where('notificationable_type="Admin"').page(params[:page] || 1).per(50).order('created_at ASC')   
    if !params[:page].nil?
      @num=(params[:page].to_i-1)*50
    else
      @num=0
    end
  end


  def new
    @notification = Notification.new
  end
  
  
  def create


		params[:notification][:notificationToId]=params[:notificationToId].collect{|a| a.split(",") }.join(",").to_s
#		params[:notification][:notificationFrequency]=params[:notificationFrequency].collect{|a| a.split(",") }.join(",").to_s


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

		    params[:notification][:notificationFrequency]=params[:notificationFrequency2].split(",").collect{|a| a.to_s.strip+".days" }.join(",").to_s
			 params[:notification][:frequency_type]="second"
		end
		
		if params[:notification][:notification_type]=="food"
			params[:notification][:mealslist]=params[:meals1].collect{|a| a.split(",") }.join(",").to_s
		end			
	
		if params[:notification][:notification_type]=="activity"
			params[:notification][:exerciseslist]=params[:exercise1].collect{|a| a.split(",") }.join(",").to_s					
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
	

				


#		nextruntime=[]
#		params[:notificationFrequency].collect{|a| a.split(",") }.join(",").to_s.each do |frequency|
#		nextruntime << Date.today+frequency.to_i
#		end
#		params[:notification][:nextrundate]=nextruntime.min
		
		
		 	
       @notification = Notification.create(params[:notification])
   	 #@emails=User.select(:email)
    	 if @notification.save
  
#writing schedule and rake task file
		Notification.updateCronTab
						       
      redirect_to(admin_notifications_path, :notice => 'Notification was successfully created.')
    else
      render :action => "new"
    end
  end



  
  def show
	  @notification=Notification.find(params[:id])
	  render :layout =>'new_admin'
  end
  

  
  def destroy
    @notification = Notification.find(params[:id])
    @notification.destroy
    
	 Notification.updateCronTab	
    redirect_to(admin_notifications_path)
    
  end

end
