class CreateWorkouts < ActiveRecord::Migration
  def self.up
    create_table :workouts do |t|
      t.belongs_to :user
      
      t.datetime :trained_on
      t.text     :note
      
      t.timestamps
    end
  end

  def self.down
    drop_table :workouts
  end
end
