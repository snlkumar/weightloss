namespace :dummy do
  desc "Weight Over Time dummy data"
  task :weight_data => :environment do
    temp = Time.zone.today.beginning_of_day
    user = User.find_by_email('user@example.com')
    user.weights.destroy_all
    
    while temp > 6.months.ago
      temp -= 1.day
      user.weights.create :weight => 250-rand(10), :created_at => temp
    end
    
  end
  
  desc "Net Calories dummy data"
  task :net_calories => :environment do
    temp   = Time.zone.today.beginning_of_day
    user   = User.find_by_email('user@example.com')
    user.meals.destroy_all
    
    while temp > 6.months.ago
      temp -= 1.day
      2.times do
        food      = Food.find(rand(7000)+1)
        unit      = food.gmwt_desc1
        meal_type = ['Breakfast', 'Lunch', 'Snack', 'Dinner'][rand(3)+1]
        params    = {"meal"=>{"meal_items_attributes"=>{Time.now.to_i.to_s => {"units"=>unit, "serving_whole"=>"10", "serving_part"=>"0", "food_id"=>food.id}}, "meal_type"=>meal_type, "ate_on_date"=>{"time"=>{"minute"=>"17", "meridian"=>"PM", "hour"=>"2"}, "date"=>temp.strftime("%m/%d/%Y")}, "note"=>""}}.with_indifferent_access
        user.meals.create(params["meal"])
      end
      
      # user.workouts.create :created_at => temp
    end
  end
end