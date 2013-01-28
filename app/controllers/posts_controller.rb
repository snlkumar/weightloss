class PostsController < ApplicationController
  layout 'public_content'
  
  before_filter :get_categories
  
  def index
    @posts = OldTextFile.where('draft=0').order("created_at DESC").page(params[:page]).per(10)
    		@meta=Meta.where("controller='Posts' and  action='index'").last
			if !@meta.blank?
			@meta_title=@meta.metatitle
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end
  end
  
  def show
    @post = OldTextFile.find(params[:id])
    @post.update_attribute(:view_count, @post.view_count + 1)
			#@meta=Meta.where("controller='ArticlesLibrary' and  page='#{@post.page_title}'").last
#			@meta=Meta.where("page like '#{@post.page_title}'").last
         @meta=Meta.find_by_controller_and_page('ArticlesLibrary',"#{@post.page_title}")
			@meta_title=@post.page_title
			if !@meta.blank?
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end	
  end

end
