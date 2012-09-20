# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base

  helper :all # include all helpers, all the time
  protect_from_forgery 
  
  layout 'application'  
  

  
   #new added code for captcha
  protected
	  RECAPTCHA_PRIVATE_KEY = '6LdI9dQSAAAAACgfiU4TKgjaoHeSOPtOvHwCiRhK';
	 
	  #try and verify the captcha response. Then give out a message to flash
	  def verify_recaptcha(remote_ip, params)
	 
	      responce = Net::HTTP.post_form(URI.parse('http://www.google.com/recaptcha/api/verify'),
	                                    {'privatekey'=>RECAPTCHA_PRIVATE_KEY, 'remoteip'=>remote_ip, 'challenge'=>params[:recaptcha_challenge_field], 'response'=> params[:recaptcha_response_field]})
	      result = {:status => responce.body.split("\n")[0], :error_code => responce.body.split("\n")[1]}
	 
	      if result[:error_code] == "incorrect-captcha-sol"
	        flash[:alert] = "The CAPTCHA solution was incorrect. Please re-try"
	      #elsif
	      #  flash[:alert] = "There has been a unexpected error with the application. Please contact the administrator. error code: #{result[:error_code]}"
	      end
	 
	      result
	  end
    
  
  # helper_method :current_user_session, :current_user, :user_signed_in?
  
  before_filter :set_grid

  def forem_user
    current_user
  end
  helper_method :forem_user
  
  def get_categories
    @categories = Category.all
  end
  
  def get_subcategories
    @subcategories = Subcategory.all
  end
  
  def set_defaults
    @slider_height = current_user.height || 60
    @slider_weight = current_user.weight || 150
  end
  
  def require_admin
    unless current_user.admin?
      store_location
      flash[:error] = "You must be an admin to access this page"
      redirect_to root_path
      return false
    end
  end
    
  def set_grid
    @grid = false
    @show_overlay = false
  end
  
  def require_no_user
    if current_user
      store_location
      redirect_to :controller => :users, :action => :next
      return false
    end
  end
  
  def after_sign_in_path_for(resource)
  
      session[:return_to] || stored_location_for(resource) || user_path(current_user)
  end
end
