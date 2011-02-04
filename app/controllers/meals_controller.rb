class MealsController < ApplicationController
  layout 'tracking'
  
  def new
    @meal = current_user.meals.new
  end
  
  def create
    @meal = current_user.meals.build(params[:meal])
    
    if @meal.save
      
    else
      
    end
  end
  
  def destroy
    
  end
end
