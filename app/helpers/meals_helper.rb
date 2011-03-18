module MealsHelper
  
  def ate_on_start_date
    params[:date] ? params[:date].to_date.strftime("%m/%d/%Y") : Date.today.strftime("%m/%d/%Y")
  end
  
  def calories_consumed_today(meals)
    meals.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += meal_item.calories } }
  end
end
