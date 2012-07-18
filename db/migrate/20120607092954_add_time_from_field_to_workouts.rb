class AddTimeFromFieldToWorkouts < ActiveRecord::Migration
  def change
    add_column :workouts, :time_from, :time
  end
end
