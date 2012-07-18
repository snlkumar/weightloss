class AddNameToFoods < ActiveRecord::Migration
  def self.up
    add_column :foods, :name, :string
    
    Food.all.each do |food|
      food.name = food.shrt_desc
      food.save
    end
  end
  
  def self.down
    remove_column :foods, :name
  end
end
