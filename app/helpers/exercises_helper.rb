module ExercisesHelper
  
  def trained_on_start_date
    params[:date] ? params[:date].to_date.strftime("%m/%d/%Y") : Date.today.strftime("%m/%d/%Y")
  end
  
end
