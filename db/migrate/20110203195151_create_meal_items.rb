class CreateMealItems < ActiveRecord::Migration
  def self.up
    create_table :meal_items do |t|
      t.belongs_to :meal
      t.belongs_to :food
      
      t.decimal    :quantity, :precision => 5, :scale => 2
      t.string     :units
      
      t.timestamps
    end
  end

  def self.down
    drop_table :meal_items
  end
end
