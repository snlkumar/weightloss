class MealsController < ApplicationController
  layout 'tracking'
  
  def new
    @meal = current_user.meals.new
  end
  
  def edit
    @meal = current_user.meals.find(params[:id])
    render :action => 'new'
  end
  
  def create
    @meal = current_user.meals.build(params[:meal])
    
    redirect_to new_meal_path
  end
  
  def destroy
    
  end
  
  def meal_item
    @food = Food.find(params[:food_id])
    Meal.new.meal_items.new(:food => @food)
  end
end
