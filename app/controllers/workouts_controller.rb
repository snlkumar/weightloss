class WorkoutsController < ApplicationController
  layout 'tracking'
  
  before_filter :authenticate_user!
  
  def index
    #if params[:ate_on]
     # @start_date = Time.zone.parse(params[:ate_on]).strftime("%Y-%m-%d")
      #@workouts   = current_user.workouts.starting_from(params[:date]).all(:order => 'trained_on DESC')
    #else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
      #@workouts   = current_user.workouts.all(:order => 'trained_on DESC')
    #end
		@workouts=Workout.find_by_sql("SELECT e.description, e.category,wi.calories,wi.duration,w.id,w.trained_on,wi.sets FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id")
		@category=Workout.find_by_sql("SELECT distinct(category),sets from (SELECT e.description, e.category,wi.calories,wi.duration,wi.sets FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id) as data")

	@setsData=Workout.find_by_sql("SELECT e.description,e.category, w.id, wi.sets, max(reps) as reps, max(weight) as weight FROM exercises e ,workout_items wi, workouts w, sets s  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id and wi.id=s.workout_items_id group by s.workout_items_id")

@weekly=Workout.find_by_sql("SELECT  sum(wi.calories) as weekly_cal, sum(wi.duration) as weekly_duration FROM workout_items wi,workouts w where w.user_id="+current_user.id.to_s+" and w.id=wi.workout_id and w.trained_on>=DATE_SUB('"+@start_date+"', INTERVAL 7 DAY) and w.trained_on <='"+@start_date+"'")

  end
#
	def data
    if params[:trained_on]
      @start_date = Time.zone.parse(params[:trained_on]).strftime("%Y-%m-%d")
      #@workouts   = current_user.workouts.starting_from(params[:date]).all(:order => 'trained_on DESC')
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
      #@workouts   = current_user.workouts.all(:order => 'trained_on DESC')
    end
		@workouts=Workout.find_by_sql("SELECT e.description, e.category,wi.calories,wi.duration,w.id,w.trained_on,wi.sets FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id")
		@category=Workout.find_by_sql("SELECT distinct(category),sets from (SELECT e.description, e.category,wi.calories,wi.duration,wi.sets FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id) as data")

	@setsData=Workout.find_by_sql("SELECT e.description,e.category, w.id, wi.sets, max(reps) as reps, max(weight) as weight FROM exercises e ,workout_items wi, workouts w, sets s  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id and wi.id=s.workout_items_id group by s.workout_items_id")

@weekly=Workout.find_by_sql("SELECT  sum(wi.calories) as weekly_cal, sum(wi.duration) as weekly_duration FROM workout_items wi,workouts w where w.user_id="+current_user.id.to_s+" and w.id=wi.workout_id and w.trained_on>=DATE_SUB('"+@start_date+"', INTERVAL 7 DAY) and w.trained_on <='"+@start_date+"'")

	render :template=>'workouts/index'	
  end
  
  #workouts dairy

  def dairy

  	if params[:date_on] && params[:date_on].downcase!="today"
      @start_date = Time.zone.parse(params[:date_on]).strftime("%Y-%m-%d")
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
    end

		@workouts=Workout.find_by_sql("SELECT wi.exercise_id,w.id,e.description,wi.calories,w.time_from,w.note,w.trained_on FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+current_user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id")

		@meals = Meal.find_by_sql("SELECT mi.food_id,m.id,f.name,m.meal_type,m.note,ifnull(mi.calories,0) as calories,ifnull(f.total_fat,0) as fat,ifnull(f.carbohydrt,0) as carbohydrt,ifnull(f.protein,0) as protein,m.ate_on from meals m,meal_items mi,foods f where f.id=mi.food_id and m.id = mi.meal_id and m.user_id=" + current_user.id.to_s + " and m.ate_on='"+ @start_date.to_s+"'")
  end
  
  #
  def new
    @workout = current_user.workouts.new(:trained_on => Time.zone.now)
  end
  
  def edit
    @workout = current_user.workouts.find(params[:id])
    render :action => 'new'
  end

  def create
		if params[:workout][:trained_on] && params[:workout][:trained_on]!="Today"
      @start_date = Time.zone.parse(params[:workout][:trained_on]).strftime("%Y-%m-%d")
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
			params[:workout][:trained_on]=@start_date
    end
		
		#for calories field data
		if !params[:workout][:duration1].empty? && !params[:workout][:time_from1].empty?
			params[:workout][:duration]=params[:workout][:duration1]
			params[:workout][:time_from]=params[:workout][:time_from1]
		end

		if params[:workout][:calories]==""
			@workout = Workout.create(:user_id=>current_user.id, :trained_on=>@start_date,:time_from=>params[:workout][:time_from])
			@w=WorkoutItem.create(:workout_id=>@workout.id,:exercise_id=>params[:workout][:exercise_id],:duration=>params[:workout][:duration].delete(" "),:user_id=>@workout.user_id)

		else
				params[:workout][:exercise_id]=809	#this is custom calories execersise id
			#for activity entry by calories
			@workout = Workout.create(:user_id=>current_user.id,:trained_on=>@start_date,:time_from=>params[:workout][:time_from],:note=>params[:workout][:note])
			@w=WorkoutItem.create(:workout_id=>@workout.id,:exercise_id=>params[:workout][:exercise_id],:duration=>params[:workout][:duration].delete(" "),:calories=>params[:workout][:calories],:user_id=>@workout.user_id)
		end
		
    #@workout = current_user.workouts.build(params[:workout])
    #@workout.save
    redirect_to dairy_workout_path #workouts_path
  end
  
  def update
    @workout = current_user.workouts.find(params[:id])
    @workout.update_attributes(params[:workout])
    redirect_to workouts_path
  end
  
  def destroy
    @workout = current_user.workouts.find(params[:id])
    @workout.destroy
    redirect_to dairy_workout_path  #workouts_path
  end

  # Ajax add to workout
  def workout_item
    @exercise     = Exercise.find(params[:exercise_id])
    @workout_item = current_user.workouts.build.workout_items.new(:exercise => @exercise, :duration => params[:duration], :user => current_user)
    
    @workout_item_fields = view_context.fields_for :workout_items, @workout_item, :child_index => "new_workout_items" do |f|
                             render_to_string(:partial => 'workout_items/workout_item_fields_ajax', :locals => {:workout_item_form => f}).html_safe
                           end
    
    respond_to do |wants|
      wants.js { render }
    end
  end	
end
