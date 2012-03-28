class PostsController < ApplicationController
  layout 'public_content'
  
  before_filter :get_categories
  
  def index
    @posts = OldTextFile.order("created_at DESC").page(params[:page]).per(10)
  end
  
  def show
    @post = OldTextFile.find(params[:id])
    @post.update_attribute(:view_count, @post.view_count + 1)
  end

end
