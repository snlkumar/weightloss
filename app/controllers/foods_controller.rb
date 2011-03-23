class FoodsController < ApplicationController
  before_filter :require_user
  
  def search
    terms  = params[:term].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "shrt_desc LIKE ?"}.join(' AND ')
    @foods = Food.with_serving_sizes.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
    render :json => @foods.map{|f| {:value => f.shrt_desc, :id => f.id} }.to_json
  end

  def meal_item_calories
    meal_item = MealItem.new(params[:meal][:meal_items_attributes].first.last)
    meal_item.determine_quantity
    meal_item.calculate_calories
    render :json => {:calories => meal_item.calories}
  end
end
