class Admin::FoodsController < Admin::BaseController
  layout 'application'
    
  def index
    @foods = Food.paginate :per_page => 50, :page => params[:page] || 1
  end
  
  def new
    @food = Food.new(:custom => true)
  end
  
  def edit
    @food = Food.find(params[:id])
  end
  
  def create
    @food = Food.new(params[:food])
    
    if @food.save
      redirect_to(admin_foods_path, :notice => 'Food was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @food = Food.find(params[:id])
    
    if @food.update_attributes(params[:food])
      redirect_to(admin_foods_path, :notice => 'Food was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @food = Food.find(params[:id])
    @food.destroy
    redirect_to(admin_foods_url)
  end
  
  def search
    terms  = params[:terms].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "name LIKE ?"}.join(' AND ')
    @foods = Food.paginate(:conditions => [conds, *terms.collect{|t| "%#{t}%"}], :per_page => 50, :page => params[:page] || 1)
    
    render :action => :index
  end
  
end
