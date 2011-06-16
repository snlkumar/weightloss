class PostsController < ApplicationController
  layout 'search'
  
  before_filter :require_user
  before_filter :get_categories, :only => :show
  
  def show
    @post = OldTextFile.find(params[:id])
  end

end
