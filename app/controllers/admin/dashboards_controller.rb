class Admin::DashboardsController < Admin::BaseController
  layout 'application'
    
  def show
    #new added code
    @users = User.page(params[:page] || 1).per(50)
    
    if @users.empty?
      @users = User.page(1).per(50)
    end
    @items = OldItem.all
    @foods = Food.page(params[:page] || 1).per(50)
    
    if @foods.empty?
      @foods = Food.page(1).per(50)
    end
    @exercises = Exercise.order('id').page(params[:page] || 1).per(50)
    
    if @exercises.empty?
      @exercises = Exercise.page(1).per(50)
    end
    @posts = OldTextFile.order('page_title ASC').page(params[:page] || 1).per(50)
    
    if @posts.empty?
      @posts = OldTextFile.page(1).per(50)
    end
    #end
  end
end
