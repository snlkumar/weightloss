class ExercisesController < ApplicationController
  before_filter :require_user
  
  def search
    terms  = params[:term].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "shrt_desc LIKE ?"}.join(' AND ')
    @exercises = Exercise.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
    render :json => @exercises.map{|f| {:value => f.shrt_desc, :id => f.id} }.to_json
  end
  
  def workout_item_calories
    workout_item = WorkoutItem.new(params[:meal][:workout_items_attributes].first.last)
    render :json => {:calories => workout_item.calories}
  end
end
