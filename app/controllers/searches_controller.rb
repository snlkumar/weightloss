class SearchesController < ApplicationController
  layout 'tracking'
  
  def new
    
  end
  
  def create
    post_search  = PostSearch.new(params[:search])
    @posts       = post_search.go
    video_search = VideoSearch.new(params[:search])
    @videos      = video_search.go
    
    @results = [@posts, @videos].flatten.sort_by{|rec| rec.created_at }
    @total   = @posts.total_entries + @videos.total_entries
    
    render :action => :new
  end
  
end
