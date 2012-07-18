class AddCustomFoodFlagToFoods < ActiveRecord::Migration
  def self.up
    add_column :foods, :custom, :boolean
    
    Food.update_all("custom = false")
  end

  def self.down
    remove_column :foods, :custom
  end
end
