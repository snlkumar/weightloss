class AddCustomFoodFlagToFoods < ActiveRecord::Migration
  def change 
    
    Food.update_all("custom = false")
  end

 
end
