class ChangeColumnTrainedOnFieldOfWorkouts < ActiveRecord::Migration
  def up
		change_column :workouts, :trained_on, :date
  end

  def down
		change_column :workouts, :trained_on, :datetime
  end
end
