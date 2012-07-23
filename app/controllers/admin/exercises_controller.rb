class Admin::ExercisesController < Admin::BaseController
  #layout 'application'
  #new code 
  layout 'new_admin' 
  
  def index
    @exercises = Exercise.order('id').page(params[:page] || 1).per(50)
  end
  
  def new
    @exercise = Exercise.new
  end
  
  def edit
    @exercise = Exercise.find(params[:id])
    
    ## new code for showing calories/Hr
    if @exercise.mets!=nil
				mets = @exercise.mets 
	  else
				mets=0
		end
		  weight_in_kilograms = (current_user ? current_user.weight : User.find(current_user.id).weight ) * 0.45
		  calories       = 60 * ((mets * 3.5 * weight_in_kilograms)/200)  # 60 denote duration(in minutes )
		  @exercise.calories=calories.round(2)
		 
		## end new code
  end
  
  def create
    @exercise = Exercise.new(params[:exercise])
    
    if @exercise.save
      redirect_to(admin_exercises_path, :notice => 'Exercise was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
  
    @exercise = Exercise.find(params[:id])
    
    ## new added code to make calories again 0
    params[:exercise][:calories]="0"
    #end
    if @exercise.update_attributes(params[:exercise])
      redirect_to(admin_exercises_path, :notice => 'Exercise was successfully updated.')
    else
      render :action => "edit"
    end
  
  end
  
  def destroy
    @exercise = Exercise.find(params[:id])
    @exercise.destroy
    
    redirect_to(admin_exercises_url)
  end
  
  def search
    terms      = params[:terms].split(/,|\s/).reject(&:blank?)
    conds      = terms.collect{|t| "description LIKE ?"}.join(' AND ')
    @exercises = Exercise.where([conds, *terms.collect{|t| "%#{t}%"}]).page(params[:page] || 1).per(50)

    render :action => :index
  end
end
