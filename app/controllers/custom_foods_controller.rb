class CustomFoodsController < ApplicationController
  layout 'tracking'
  
 	 before_filter :authenticate_user!
  
  def new
    if params[:name]
      @food = Food.new(:name=>params[:name],:custom => true)
    else
      @food = Food.new(:custom => true)
    end
  end

  def create
		session[:fd_name]=params[:food]["name"]
		@food = Food.new(params[:food])
    if @food.save
      redirect_to new_meal_path
    else
      render :action => 'new'
    end
  end

def show
end
#new added method for update meal(servings)
def update_meal
    @food = Food.find(params[:id])
		@food.gmwt_desc1 = params[:food_name]
		@food.save!	
    render :text=>"food updated"
end


end
