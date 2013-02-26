class Forem::ApplicationController < ApplicationController
  layout 'forem'
  
  helper Myweightworld::Application.helpers
  
  private
  
  def authenticate_forem_user
    if !forem_user
      session[:return_to] = request.fullpath
      #flash[:error] = t("forem.errors.not_signed_in")
      redirect_to main_app.sign_in_path
    end
  end
  
  def forem_admin?
    forem_user && forem_user.forem_admin?
  end
  helper_method :forem_admin?

end
