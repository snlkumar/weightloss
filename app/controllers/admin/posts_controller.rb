class Admin::PostsController < Admin::BaseController
  layout 'admin'
  
  def index
    @posts = OldTextFile.order('page_title ASC').page(params[:page] || 1).per(50)
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
      #redirect_to(admin_posts_path, :notice => "Successfully updated Post: #{@post.page_title}")
      redirect_to(admin_dashboard_path, :notice => "Successfully updated Post: #{@post.page_title}")
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @post = OldTextFile.find(params[:id])
    @post.destroy
    #redirect_to(admin_posts_path)
    redirect_to(admin_dashboard_url)
  end
  
  def search
    terms      = params[:terms].split(/,|\s/).reject(&:blank?)
    conds      = terms.collect{|t| "page_title LIKE ?"}.join(' AND ')
    @posts = OldTextFile.where([conds, *terms.collect{|t| "%#{t}%"}]).page(params[:page] || 1).per(50)
    
    render :action => :index
    
  end
end
