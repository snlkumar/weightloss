class Admin::FoodsController < Admin::BaseController
  layout 'application'
    
  def index
    @foods = Food.paginate :per_page => 50, :page => params[:page] || 1
  end
  
  def show
    @food = Food.find(params[:id])
  end
  
  def new
    @food = Food.new
  end
  
  def edit
    @food = Food.find(params[:id])
  end
  
  def create
    @food = Food.new(params[:food])
    
    if @food.save
      redirect_to(@food, :notice => 'Food was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @food = Food.find(params[:id])
    
    if @food.update_attributes(params[:food])
      redirect_to(@food, :notice => 'Food was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @food = Food.find(params[:id])
    @food.destroy
    redirect_to(admin_foods_url)
  end
end
