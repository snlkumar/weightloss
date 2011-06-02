class PostSearch
  attr_accessor :keywords
  
  def initialize(params = {})
    debugger
    @keywords     = params[:keywords] ? params[:keywords].gsub(/[^a-zA-Z0-9\s]/, '').split(/\s/) : []
    @per_page     = 15
    @page         = params[:page] || 1
    
    @query_string = []
    @query_params = []
  end
  
  def query
    if @query_string.blank?
      ""
    else
      [@query_string.join(' AND '), *@query_params]
    end
  end
  
  def add_keywords
    return if @keywords.empty?
    
    temp = @keywords.collect do |term|
      @query_params << "%#{term}%"
      "page_title LIKE ?"
    end
    
    @query_string << "(#{ temp.join(' OR ') })"
  end
  
  def build_query
    add_keywords
  end
  
  def go
    return [] if @query_string.nil?
    build_query
    OldTextFile.paginate(:all, :conditions => query, :per_page => @per_page, :page => @page)
  end
  
end