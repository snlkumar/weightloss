class Admin::ExercisesController < Admin::BaseController
  layout 'application'
    
  def index
    @exercises = Exercise.paginate :per_page => 50, :page => params[:page] || 1
  end
  
  def new
    @exercise = Exercise.new
  end
  
  def edit
    @exercise = Exercise.find(params[:id])
  end
  
  def create
    @exercise = Exercise.new(params[:exercise])
    
    if @exercise.save
      redirect_to(@exercise, :notice => 'Exercise was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @exercise = Exercise.find(params[:id])
    
    if @exercise.update_attributes(params[:exercise])
      redirect_to(@exercise, :notice => 'Exercise was successfully updated.')
    else
      render :action => "edit"
    end
  
  end
  
  def destroy
    @exercise = Exercise.find(params[:id])
    @exercise.destroy
    
    redirect_to(admin_exercises_url)
  end
end
