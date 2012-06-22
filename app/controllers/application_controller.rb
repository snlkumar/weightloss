# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery 
  
  layout 'application'
  
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
      stored_location_for(resource) || user_path(current_user)
  end
end
