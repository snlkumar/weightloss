class HomeController < ApplicationController
  
  def index
    @recent_members = User.recent
    posts = OldTextFile.select("id").all
    @recent_posts = OldTextFile.find(posts.slice(rand(posts.size - 1), 2).map(&:id))
    @popular_posts = OldTextFile.order("view_count DESC").limit(2)
    
    render :layout => 'homepage'
  end
  
  def terms
    
  end
  
  def privacy
    
  end
  
  def about
    
  end

  #new added method for refreshing window for remove iframe
  def refresh_window
  end
  #end
end
