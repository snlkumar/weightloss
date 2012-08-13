class Admin::UsersController < Admin::BaseController
  before_filter :set_defaults, :only => [:new, :edit]
  
  #layout 'application'
  #new added code
  layout 'new_admin'
  
  def index
    @users = User.page(params[:page] || 1).per(50)
    
   end
  
  def new
    @user = User.new
    @slider_height = @user.height || 60
    @slider_weight = @user.weight || 150

  end
  
  def edit
    @user = User.find(params[:id])
    @slider_height = @user.height || 60
    @slider_weight = @user.weight || 150

  end
  
  def create
    @user = User.new(params[:user])
    
    if @user.save
      #redirect_to(@user, :notice => 'User was successfully created.')
      #new code
      redirect_to(admin_users_path, :notice => 'User was successfully created.')
    else
      render :action => "new"
    end

  end
  
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(params[:user])
      #new code for admin access
      #if same user update admin access so
      if current_user.id==@user.id
          #check updated user admin or not
         if @user.admin==false
           sign_out(@user)
           redirect_to("/refresh_window")
         else
          redirect_to(admin_users_path, :notice => 'User was successfully updated.')
         end
      else
        redirect_to(admin_users_path, :notice => 'User was successfully updated.')
      end
    else
      render :action => "edit"
    end
    
  end
  
  def destroy
    @user = User.find(params[:id])
    @user.destroy
    redirect_to(admin_users_path)
  end
end
