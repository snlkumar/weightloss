class UserPasswordsController < ApplicationController
  before_filter :authenticate_user!
  
  layout "user_settings"
  
  def edit
    @user = current_user
  end
  
  def update
    @user = current_user
    
    if @user.update_with_password(params[:user])
      sign_in(@user, :bypass => true)
      # devise is stealing my edit_password_path helper! using string for now
      redirect_to '/password/edit', :notice => 'Password updated'
    else
      render :edit
    end
  end
  
  
end
