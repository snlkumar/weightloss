class MealsController < ApplicationController
  layout 'tracking'
  
  before_filter :authenticate_user!
  
  def index
    #if params[:date]
      #@start_date = Time.zone.parse(params[:date]).strftime("%Y-%m-%d")
   # else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
   # end

		@meals = Meal.find_by_sql("SELECT f.shrt_desc,f.name,ifnull(f.total_fat,0) as total_fat,ifnull(f.carbohydrt,0) as carbohydrt,ifnull(f.energ_kcal,0) as energ_kcal,ifnull(f.protein,0) as protein,m.meal_type,mi.meal_id,ifnull(mi.calories,0) as calories,m.ate_on from meals m,meal_items mi,foods f where f.id=mi.food_id and m.id = mi.meal_id and m.user_id=" + current_user.id.to_s + " and m.ate_on='"+ @start_date.to_s+"'")

  end

	def data
		if params[:ate_on]
      @start_date = Time.zone.parse(params[:ate_on]).strftime("%Y-%m-%d")
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
    end

		@meals = Meal.find_by_sql("SELECT f.shrt_desc,f.name,ifnull(f.total_fat,0) as total_fat,ifnull(f.carbohydrt,0) as carbohydrt,ifnull(f.energ_kcal,0) as energ_kcal,ifnull(f.protein,0) as protein,m.meal_type,mi.meal_id,ifnull(mi.calories,0) as calories,m.ate_on from meals m,meal_items mi,foods f where f.id=mi.food_id and m.id = mi.meal_id and m.user_id=" + current_user.id.to_s + " and m.ate_on='"+ @start_date.to_s+"'")

	render :template=>'meals/index'	
	end

	def new
   	 @meal = current_user.meals.new(:ate_on => Time.zone.now)
	  end

  def edit
    @meal = current_user.meals.find(params[:id])
    render :action => 'new'
  end
  
  def create
		#@meal = current_user.meals.build(params[:meal])		
		#
		#raise params[:ate_on].inspect
		
		if params[:meal_cal]=="meal"
			params[:meal][:meal_type]=params[:meal_type1]
		else
			params[:meal][:meal_type]=params[:meal_type2]
		end

		if params[:ate_on] && params[:ate_on]!="Today"
      @start_date = Time.zone.parse(params[:ate_on]).strftime("%Y-%m-%d")
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
    end


		if params[:meal][:calories]==""
    	@meal = current_user.meals.create(:ate_on=>@start_date,:meal_type=>params[:meal][:meal_type],:time_of_day=>Time.zone.now.strftime("%H-%M-%S"))
			@meal.meal_items.create(:food_id=>params[:meal][:food_id],:serving=>params[:meal][:serving].delete(" "),:units=>params[:meal][:units])
			else
				#for food custom entry by calory
				@meal = current_user.meals.create(:ate_on=>@start_date,:note => params[:meal][:note],:meal_type=>params[:meal][:meal_type],:time_of_day=>Time.zone.now.strftime("%H-%M-%S"))
			@meal.meal_items.create(:food_id=>8443,:calories=>params[:meal][:calories])
		end
   #
    redirect_to dairy_workout_path #meals_path
  end
  
  def update
    @meal = current_user.meals.find(params[:id])
    @meal.update_attributes(params[:meal])
    redirect_to meals_path
  end
  
  def destroy
    @meal = current_user.meals.find(params[:id])
    @meal.destroy	#for meal record deleted
		@meal.meal_items.destroy	#for meal_items record deleted
		
    redirect_to dairy_workout_path #meals_path
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
