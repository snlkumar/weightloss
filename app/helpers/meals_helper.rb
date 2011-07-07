module MealsHelper
  
  def ate_on_start_date(obj)
    if params[:date]
      params[:date].to_date.strftime("%m/%d/%Y")
    elsif obj
      obj.ate_on.strftime("%m/%d/%Y")
    else
      Date.today.strftime("%m/%d/%Y")
    end
  end
  
end
