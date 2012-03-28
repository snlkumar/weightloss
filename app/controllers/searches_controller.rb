class SearchesController < ApplicationController
  before_filter :get_categories
  
  def index
    redirect_to new_search_path()
  end
  
  def new
    if user_signed_in?
      render :layout => 'search'
    else
      render :layout => 'public_search'
    end
  end
  
  def create
    # (redirect_to(new_search_path) && return) if params[:search].nil?
    
    @search  = ContentSearch.new(params)
    
    @results = Kaminari.paginate_array( @search.results ).page(params[:page] || 1).per(25)
    @total   = @search.total
    
    if user_signed_in?
      render :action => :new, :layout => 'search'
    else
      render :action => :new, :layout => 'public_search'
    end
  end
  
  
end
