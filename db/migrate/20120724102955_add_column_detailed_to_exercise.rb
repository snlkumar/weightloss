class AddColumnDetailedToExercise < ActiveRecord::Migration
  def change
    add_column :exercises, :detailes, :text
  end
  def down
    remove_column :exercises, :detailes
  end
end
