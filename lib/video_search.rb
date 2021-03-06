class VideoSearch
  attr_accessor :keywords, :category, :per_page
  
  def initialize(params = {})
    @keywords     = params[:keywords] ? params[:keywords].gsub(/[^a-zA-Z0-9\s]/, '').split(/\s/) : []
#    @per_page     = 15
#    @page         = params[:page] || 1
    @category_id  = params[:category_id] || nil
    
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
      "title LIKE ?"
    end
    
    @query_string << "(#{ temp.join(' AND ') })"
  end
  
  def add_category
    return if @category_id.blank?
    
    @query_params << @category_id
    @query_string << 'categories.id = ?'
  end
  
  def build_query
    add_keywords
    add_category
  end
  
  def go
    return [] if @query_string.nil?
    build_query
    if @query_string.empty?
      OldFlashFile.all
    else
#      OldFlashFile.includes(:category).where(query).page(@page).per(@per_page)
      OldFlashFile.includes(:category).where(query)
    end
  end
  
end
