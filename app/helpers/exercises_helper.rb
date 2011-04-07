module ExercisesHelper
  
  def trained_on_start_date
    params[:date] ? params[:date].to_date.strftime("%m/%d/%Y") : Date.today.strftime("%m/%d/%Y")
  end
  
  def calories_burned_today(workouts)
    workouts.inject(0){|tot, workout| tot += workout.workout_items.inject(0){|workout_tot, workout_item| workout_tot += workout_item.calories } }
  end
  
  def calories_burned_this_week(workouts)
    workouts.inject(0){|tot, workout| tot += workout.workout_items.inject(0){|workout_tot, workout_item| workout_tot += workout_item.calories } }
  end
end
