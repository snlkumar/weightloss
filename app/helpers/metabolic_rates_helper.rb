module MetabolicRatesHelper
  
  def five_hundred_calorie_deficit(user)
    user.bmr - 500
  end
  
  def one_thousand_calorie_deficit(user)
    user.bmr - 1000
  end
  
  def pounds_to_lose(user)
    if user.desired_weight
      user.weight - user.desired_weight
    else
      0
    end
  end
  
  def days_to_goal(user, daily_deficity)
    total_calories_to_lose = pounds_to_lose(current_user) * 3500
    (total_calories_to_lose / daily_deficity).round
  end
end
