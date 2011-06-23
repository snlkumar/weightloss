class Admin::PostsController < ApplicationController
  layout 'admin'
  
  def index
    @posts = OldTextFile.paginate :per_page => 50, :page => params[:page] || 1
  end
  
  def new
    @post = OldTextFile.new
  end
  
  def edit
    @post = OldTextFile.find(params[:id])
  end
  
  def create
    @post = OldTextFile.new(params[:post])
    
    if @post.save
      redirect_to(admin_posts_path, :notice => 'Post was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @post = OldTextFile.find(params[:id])
    
    if @post.update_attributes(params[:post])
      redirect_to(admin_posts_path, :notice => "Successfully updated Post: #{@post.page_title}")
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @post = OldTextFile.find(params[:id])
    @post.destroy
    redirect_to(admin_posts_path)
  end

end
