class AddSetsFieldsToWorkoutItems < ActiveRecord::Migration
  def change
    add_column :workout_items, :sets, :int
  end
end
