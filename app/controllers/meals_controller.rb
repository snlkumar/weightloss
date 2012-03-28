class MealsController < ApplicationController
  layout 'tracking'
  
  before_filter :authenticate_user!
  
  def index
    if params[:date]
      @start_date = Time.zone.parse params[:date]
      @meals      = current_user.meals.starting_from(params[:date]).all(:order => 'time_of_day DESC')
    else
      @start_date = Time.zone.now
      @meals      = current_user.meals.all(:order => 'time_of_day DESC')
    end
  end
  
  def new
    @meal = current_user.meals.new(:ate_on => Time.zone.now)
  end
  
  def edit
    @meal = current_user.meals.find(params[:id])
    render :action => 'new'
  end
  
  def create
    @meal = current_user.meals.build(params[:meal])
    @meal.save
    redirect_to meals_path
  end
  
  def update
    @meal = current_user.meals.find(params[:id])
    @meal.update_attributes(params[:meal])
    redirect_to meals_path
  end
  
  def destroy
    @meal = current_user.meals.find(params[:id])
    @meal.destroy
    redirect_to meals_path
  end
  
  # Ajax add to meal
  def meal_item
    @food      = Food.find(params[:food_id])
    @meal_item = Meal.new.meal_items.new(:food => @food)
    
    @meal_item_fields = view_context.fields_for :meal_items, @meal_item, :child_index => "new_meal_items" do |f|
                       render_to_string(:partial => 'meal_items/meal_item_fields_ajax', :locals => {:meal_item_form => f}).html_safe
                     end
                     
    respond_to do |wants|
      wants.js { render }
    end
  end
end
