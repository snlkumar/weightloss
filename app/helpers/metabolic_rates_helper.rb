module MetabolicRatesHelper
  
  def five_hundred_calorie_deficit(user)
    if user.bmr
      user.bmr - 500
    else
      0
    end
  end
  
  def one_thousand_calorie_deficit(user)
    if user.bmr
      user.bmr - 1000
    else
      0
    end
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
