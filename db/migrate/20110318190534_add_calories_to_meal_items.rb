class AddCaloriesToMealItems < ActiveRecord::Migration
  def self.up
    add_column :meal_items, :calories, :integer
  end

  def self.down
    remove_column :meal_items, :calories
  end
end