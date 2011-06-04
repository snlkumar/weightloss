class FoodsController < ApplicationController
  before_filter :require_user
  
  def search
    terms  = params[:term].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "name LIKE ?"}.join(' AND ')
    @foods = Food.with_a_serving_size.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
    if @foods.empty?
      render :json => [{:value => 'No Results', :id => nil}].to_json
    else
      render :json => @foods.map{|f| {:value => (f.custom? ? "#{f.name} **" : f.name), :id => f.id} }.to_json
    end
    
  end

  def meal_item_calories
    meal_item = MealItem.new(params[:meal][:meal_items_attributes].first.last)
    meal_item.determine_quantity
    meal_item.calculate_calories
    render :json => {:calories => meal_item.calories}
  end
end
