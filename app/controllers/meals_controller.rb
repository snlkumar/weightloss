class MealsController < ApplicationController
  layout 'tracking'
  
  def index
    if params[:date]
      @start_date = params[:date].to_date
      @meals      = current_user.meals.starting_from(params[:date]).all(:order => 'time_of_day DESC')
    else
      @start_date = Time.zone.now.to_date
      @meals      = current_user.meals.all(:order => 'time_of_day DESC')
    end
  end
  
  def new
    @meal = current_user.meals.new
  end
  
  def edit
    @meal = current_user.meals.find(params[:id])
    render :action => 'new'
  end
  
  def create
    @meal = current_user.meals.build(params[:meal])
    @meal.save
    redirect_to new_meal_path
  end
  
  def update
    @meal = current_user.meals.find(params[:id])
    @meal.update_attributes(params[:meal])
    redirect_to meals_path
  end
  
  def destroy
    
  end
  
  # Ajax add to meal
  def meal_item
    @food      = Food.find(params[:food_id])
    @meal_item = Meal.new.meal_items.new(:food => @food)
  end
end
