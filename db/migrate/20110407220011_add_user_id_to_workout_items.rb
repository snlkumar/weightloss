class AddUserIdToWorkoutItems < ActiveRecord::Migration
  def self.up
    add_column :workout_items, :user_id, :integer
  end

  def self.down
    remove_column :workout_items, :user_id
  end
end
