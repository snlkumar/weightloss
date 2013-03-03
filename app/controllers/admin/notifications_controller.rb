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
		params[:notification][:notificationFrequency]=params[:notificationFrequency].collect{|a| a.split(",") }.join(",").to_s
       @notification = Notification.create(params[:notification])
   	 #@emails=User.select(:email)
    	 if @notification.save
  
#writing schedule and rake task file
					`rm -f '#{Rails.root}/config/schedule.rb' '#{Rails.root}/lib/tasks/sendnotifications.rake'`
				 envr = 'set :environment,"development"'
				 `echo '#{envr}' >> '#{Rails.root}/config/schedule.rb'`
				 auto_mail = Notification.all
				 if auto_mail
					i=0
							auto_mail.each do |a|
							 a.notificationFrequency.split(",").each do |frequency|
							 	@cron_time="every "+frequency+", "+':at=>'+" "+'"'+params[:time]+'"'
							  	txt =@cron_time+" "+'do
								 rake "sendnotifications'+i.to_s+'"
							  end'
							  	task='task :sendnotifications'+i.to_s+' => :environment do
								 obj = NotificationsController.new
							 	 obj.'+a.notification_type+'AutoNotifications
							  end'
							  `echo '#{txt}' >> '#{Rails.root}/config/schedule.rb'`
							  `echo '#{task}' >> '#{Rails.root}/lib/tasks/sendnotifications.rake'`
							  i+=1
							 end
							end
					`whenever -i`
				 end
    
  
       
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
    redirect_to(admin_notifications_path)
    
  end

end
