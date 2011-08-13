class ExercisesController < ApplicationController
  before_filter :authenticate_user!
  
  def search
    terms     = params[:term].split(/,|\s/).reject(&:blank?)
    # category LIKE :#{in_words} OR 
    conds     = terms.enum_with_index.map{|t, index| in_words = index.to_s.en.numwords; "description LIKE :#{in_words}"}.join(' AND ')
    term_hash = {}
    
    terms.each_with_index{|term, index| term_hash[index.to_s.en.numwords.to_sym] = "%#{term}%"}
    
    @exercises = Exercise.find(:all, :conditions => [conds, term_hash])
    
    render :json => @exercises.map{|f| {:value => f.description, :id => f.id} }.to_json
  end
  
  def workout_item_calories
    workout_item = WorkoutItem.new(params[:meal][:workout_items_attributes].first.last)
    render :json => {:calories => workout_item.calories}
  end
end
