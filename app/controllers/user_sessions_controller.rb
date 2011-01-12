class UserSessionsController < ApplicationController
  before_filter :require_user,    :only => :destroy
  
  def new
    current_user_session.destroy if current_user_session
    @user_session = UserSession.new
  end
  
  def create
    current_user_session.destroy if current_user_session
    @user_session = UserSession.new(params[:user_session])
    if @user_session.save
      flash[:notice] = "Login successful!"
      redirect_to user_path(@user_session.user)
    else
      render :action => :new
    end
  end
  
  def destroy
    current_user_session.destroy
    flash[:notice] = "Logout successful!"
    redirect_to new_user_session_url
  end
end
