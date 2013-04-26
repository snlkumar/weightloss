class Admin::FoodsController < Admin::BaseController
  #layout 'application'
   #new code 
  layout 'new_admin'
  
  def index
    if params[:adminApproved]
    @foods = Food.where("adminApproved=0").page(params[:page] || 1).per(50)
     else
     @foods = Food.where("adminApproved=1").page(params[:page] || 1).per(50)    
     end
  end


  
  def new
    @food = Food.new(:custom => true)
  end
  
  def edit
    @food = Food.find(params[:id])
  end
  
  def create
  	params[:food][:shrt_desc]=params[:food][:name]
    @food = Food.new(params[:food])
    
    if @food.save
      redirect_to(admin_foods_path, :notice => 'Food was successfully created.')
    else
      render :action => "new"
    end
  end

  
  def update
	 params[:food][:food_category]=params[:food_category].collect{|a| a.split(",") }.join(",").to_s

    @food = Food.find(params[:id])
    
    if @food.update_attributes(params[:food])
      redirect_to(admin_foods_path, :notice => 'Food was successfully updated.')
    else
      render :action => "edit"
    end
  end



 def adminApproved   
    @food = Food.find(params[:id])    
    if @food.update_attributes(:adminApproved=>1)
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
    @foods = Food.where([conds, *terms.collect{|t| "%#{t}%"}]).page(params[:page] || 1).per(50)
    
    render :action => :index
  end
  
end
