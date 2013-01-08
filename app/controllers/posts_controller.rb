class PostsController < ApplicationController
  layout 'public_content'
  
  before_filter :get_categories
  
  def index
    @posts = OldTextFile.where('draft=0').order("created_at DESC").page(params[:page]).per(10)
    		@meta=Meta.where("controller='Video Library' and  page='Videos List'").last
			if !@meta.blank?
			@meta_title=@meta.metatitle
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end
  end
  
  def show
    @post = OldTextFile.find(params[:id])
    @post.update_attribute(:view_count, @post.view_count + 1)
	 @meta_title=@post.page_title    
  end

end
