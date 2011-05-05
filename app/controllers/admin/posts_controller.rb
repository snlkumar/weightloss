class Admin::PostsController < ApplicationController
  layout 'application'
  
  def index
    @posts = Post.paginate :per_page => 50, :page => params[:page] || 1
  end
  
  def new
    @post = Post.new
  end
  
  def edit
    @post = Post.find(params[:id])
  end
  
  def create
    @post = Post.new(params[:post])
    
    if @post.save
      redirect_to(admin_posts_path, :notice => 'Post was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @post = Post.find(params[:id])
    
    if @post.update_attributes(params[:post])
      redirect_to(admin_posts_path, :notice => 'Post was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    redirect_to(admin_posts_path)
  end

end
