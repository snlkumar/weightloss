class PostsController < ApplicationController
  layout 'search'
  
  before_filter :authenticate_user!
  before_filter :get_categories, :only => :show
  
  def show
    @post = OldTextFile.find(params[:id])
  end

end
