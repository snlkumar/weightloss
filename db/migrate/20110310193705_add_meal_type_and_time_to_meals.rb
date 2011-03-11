class AddMealTypeAndTimeToMeals < ActiveRecord::Migration
  def self.up
    add_column :meals, :meal_type, :string
    add_column :meals, :time_of_day, :datetime
  end

  def self.down
    remove_column :meals, :time
    remove_column :meals, :meal_type
  end
end