class HomeController < ApplicationController
  
  def index
    @recent_members = User.recent
    render :layout => 'homepage'
  end
  
  def terms
    
  end
  
  def privacy
    
  end
end
