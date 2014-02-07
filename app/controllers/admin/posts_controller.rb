class Admin::PostsController < Admin::BaseController
  #layout 'admin'
    #new code 
  layout 'new_admin'
  
  def index
    @posts = OldTextFile.where('draft=0').order('page_title ASC').page(params[:page] || 1).per(50)   
    if !params[:page].nil?
      @num=(params[:page].to_i-1)*50
    else
      @num=0
    end
  end
  
  def drafts
    @posts = OldTextFile.where('draft=1').order('page_title ASC').page(params[:page] || 1).per(50)   
    if !params[:page].nil?
      @num=(params[:page].to_i-1)*50
    else
      @num=0
    end
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
   @meta=Meta.create(:url=>"articles/"+@post.page_title.gsub(/[^0-9a-z'_ ]/i, '').strip.gsub(/\s+/, "-") , :controller=>"ArticlesLibrary", :page=>@post.page_title, :action=>"show", :metatitle=>@post.page_title)
      redirect_to(admin_posts_path, :notice => 'Post was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @post = OldTextFile.find(params[:id])
    @meta=Meta.find_by_controller_and_page('ArticlesLibrary',"#{@post.page_title}")   
    if @post.update_attributes(params[:post])
    	@meta.update_attributes(:page=>params[:post][:page_title],:metatitle=>params[:post][:page_title])   
    	 
      redirect_to(admin_posts_path, :notice => "Successfully updated Post: #{@post.page_title}")
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @post = OldTextFile.find(params[:id])
    @meta=Meta.find_by_controller_and_page('ArticlesLibrary',"#{@post.page_title}")
    @post.destroy
    @meta.destroy
    redirect_to(admin_posts_path)
    
  end
  
  def search
    terms      = params[:terms].split(/,|\s/).reject(&:blank?)
    conds      = terms.collect{|t| "page_title LIKE ?"}.join(' AND ')
    @posts = OldTextFile.where([conds, *terms.collect{|t| "%#{t}%"}]).page(params[:page] || 1).per(50)
    
    if !params[:page].nil?
      @num=(params[:page].to_i-1)*50
    else
      @num=0
    end
    render :action => :index
    
  end
end
