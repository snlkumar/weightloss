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

		#params[:notification][:notificationToId]=params[:notificationToId].collect{|a| a.split(",") }.join(",").to_s
       @notification = Notification.create(params[:notification])
   	 @emails=User.select(:email)
		@user=User.find(129)
        
    	if @notification.save

        BusinessclaimMailer.delay.usernotifications(@notification,@user)      	
        
        
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
