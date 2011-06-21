class SearchesController < ApplicationController
  layout 'search'
  
  before_filter :get_categories
  
  def index
    redirect_to new_search_path()
  end
  
  def new
    
  end
  
  def create
    (redirect_to(new_search_path) && return) if params[:search].nil?
    
    @post_search  = PostSearch.new(params[:search])
    @posts        = @post_search.go
    @video_search = VideoSearch.new(params[:search])
    @videos       = @video_search.go
    
    @results = [@posts, @videos].flatten.sort_by{|rec| rec.created_at }
    @total   = @posts.total_entries + @videos.total_entries
    
    render :action => :new
  end
  
  
end
