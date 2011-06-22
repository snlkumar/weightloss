class ContentSearch
  attr_accessor :post_search, :posts, :video_search, :videos, :total, :filter
  
  FILTERS = [['All Results', 'all'], ['Articles', 'articles'], ['Videos', 'videos']]
  
  def initialize(params = {})
    @posts  = @videos = []
    @filter = params[:search][:filter]
    
    case @filter
    when 'articles'
      @post_search  = PostSearch.new(params[:search])
      @posts        = @post_search.go
      @total        = @posts.total_entries
      
    when 'videos'
      @video_search = VideoSearch.new(params[:search])
      @videos       = @video_search.go
      @total        = @videos.total_entries
      
    else
      @post_search  = PostSearch.new(params[:search])
      @posts        = @post_search.go
      
      @video_search = VideoSearch.new(params[:search])
      @videos       = @video_search.go
      
      @total        = @posts.total_entries + @videos.total_entries
    end
    
  end
  
  def results
    [@posts, @videos].flatten.sort_by{|rec| rec.created_at }
  end
  
  def category
    @post_search.try(:category) || @video_search.try(:category)
  end
end