class ContentSearch
  attr_accessor :post_search, :posts, :video_search, :videos, :total, :filter
  
  FILTERS = [['All Results', 'all'], ['Articles', 'articles'], ['Videos', 'videos']]
  
  def initialize(params = {})
    @posts  = @videos = []
    @filter = params[:search].try(:[], :filter)
    
    case @filter
    when 'articles'
      @post_search  = PostSearch.new(params[:search])
      @posts        = @post_search.go
      @total        = @posts.size
      
    when 'videos'
      @video_search = VideoSearch.new(params[:search])
      @videos       = @video_search.go
      @total        = @videos.size
      
    else
      if params[:search]
        @post_search  = PostSearch.new(params[:search])
        @posts        = @post_search.go
      
        @video_search = VideoSearch.new(params[:search])
        @videos       = @video_search.go
      else
        @posts        = OldTextFile.all
        @videos       = OldFlashFile.all
      end
      
      @total        = @posts.size + @videos.size
    end
    
  end
  
  def results
    [@posts, @videos].flatten.sort_by{|rec| rec.created_at }
  end
  
  def category
    @post_search.try(:category) || @video_search.try(:category)
  end
end