class CreateWorkoutItems < ActiveRecord::Migration
  def self.up
    create_table :workout_items do |t|
      t.belongs_to :workout
      t.belongs_to :exercise
      
      t.integer :calories
      t.integer :duration
      t.timestamps
    end
  end

  def self.down
    drop_table :workout_items
  end
end
