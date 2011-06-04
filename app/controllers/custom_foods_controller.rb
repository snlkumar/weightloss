class CustomFoodsController < ApplicationController
  layout 'tracking'
  
  before_filter :require_user
  
  def new
    @food = Food.new(:custom => true)
  end

  def create
    @food = Food.new(params[:food])
    
    if @food.save
      redirect_to new_meal_path
    else
      render :action => 'new'
    end
  end

end
