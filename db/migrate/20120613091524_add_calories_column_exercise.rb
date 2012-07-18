class AddCaloriesColumnExercise < ActiveRecord::Migration
  def up
  	 add_column :exercises, :calories, :float, :default => 0
  end

  def down
  		remove_column :exercises, :calories
  end
end
