class AddColumnDetailedToExercise < ActiveRecord::Migration
  def change
    add_column :exercises, :detailed, :text
  end
  def down
    remove_column :exercises, :detailed
  end
end
