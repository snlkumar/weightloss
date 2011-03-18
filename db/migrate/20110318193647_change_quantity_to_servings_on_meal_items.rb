class ChangeQuantityToServingsOnMealItems < ActiveRecord::Migration
  def self.up
    rename_column :meal_items, :quantity, :serving
  end

  def self.down
    rename_column :meal_items, :serving, :quantity
  end
end