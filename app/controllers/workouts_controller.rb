class WorkoutsController < ApplicationController
  layout 'tracking'
  
  before_filter :require_user
  
  def index
    if params[:date]
      @start_date = Time.zone.parse params[:date]
      @workouts   = current_user.workouts.starting_from(params[:date]).all(:order => 'trained_on DESC')
    else
      @start_date = Time.zone.now
      @workouts   = current_user.workouts.all(:order => 'trained_on DESC')
    end
  end
  
  def new
    @workout = current_user.workouts.new(:trained_on => Time.zone.now)
  end
  
  def edit
    @workout = current_user.workouts.find(params[:id])
    render :action => 'new'
  end
  
  def create
    @workout = current_user.workouts.build(params[:workout])
    @workout.save
    redirect_to workouts_path
  end
  
  def update
    @workout = current_user.workouts.find(params[:id])
    @workout.update_attributes(params[:workout])
    redirect_to workouts_path
  end
  
  def destroy
    @workout = current_user.workouts.find(params[:id])
    @workout.destroy
    redirect_to workouts_path
  end
  
  # Ajax add to workout
  def workout_item
    @exercise     = Exercise.find(params[:exercise_id])
    @workout_item = current_user.workouts.build.workout_items.build(:exercise => @exercise, :duration => params[:duration], :user => current_user)
  end
end
