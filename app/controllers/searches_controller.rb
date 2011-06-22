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
    
    @search  = ContentSearch.new(params)
    
    @results = @search.results
    @total   = @search.total
    
    render :action => :new
  end
  
  
end
