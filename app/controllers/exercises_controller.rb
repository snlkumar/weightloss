class ExercisesController < ApplicationController
  layout 'tracking'   #new added layout
  
  before_filter :authenticate_user!
  
  def search
    terms     = params[:term].split(/,|\s/).reject(&:blank?)
    # category LIKE :#{in_words} OR 
    conds     = terms.each_with_index.map{|t, index| in_words = index.to_s.en.numwords; "description LIKE :#{in_words}"}.join(' AND ')
    term_hash = {}
    
    terms.each_with_index{|term, index| term_hash[index.to_s.en.numwords.to_sym] = "%#{term}%"}
    
    @exercises = Exercise.find(:all, :conditions => [conds, term_hash])
    
    #render :json => @exercises.map{|f| {:value => "#{f.description} - #{f.calories} Cal/Hr", :id => f.id} }.to_json
    
    ##
    @weight = (self.current_user ? self.current_user.weight : User.find(self.current_user.id).weight ) * 0.45
    ##
    render :json => @exercises.map{|f| {:value => "#{f.description} @$% #{f.mets ? (60*f.mets*3.5*@weight/200) : (0)} Cal/Hr", :id => f.id} }.to_json
    # to split data this (@$%) sign base in dairy.html.erb page
  end
  
  def workout_item_calories
    workout_item = WorkoutItem.new(params[:meal][:workout_items_attributes].first.last)
    render :json => {:calories => workout_item.calories}
  end
  
  #new added code
  def show
    params[:id]=((params[:id].gsub(/[$]+/, '.')).gsub(' or ',"/")).gsub(/["%"]+/,'%')
  
    @exercise=Exercise.find_by_description(params[:id])
    
    if @exercise.nil?
      flash[:notice]=params[:id]+" exercise not exist."
    elsif @exercise.mets!=nil
				mets = @exercise.mets 
	  else
				mets=0
		end
		
		if !@exercise.nil?
	    weight_in_kilograms = (current_user ? current_user.weight : User.find(current_user.id).weight ) * 0.45
	    calories       = 60 * ((mets * 3.5 * weight_in_kilograms)/200)  # 60 denote duration(in minutes )
	    @exercise.calories=calories.round(2)
	  end
  end
  #end
end
