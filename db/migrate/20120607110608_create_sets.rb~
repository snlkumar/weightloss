class CreateSets < ActiveRecord::Migration
  def change
    create_table :sets do |t|
      t.integer :workout_items_id
      t.integer :set_no
      t.integer :reps
      t.string 	:tut
			t.string 	:weight
      t.string 	:rest
      t.time 		:time_duration

      t.timestamps
    end
  end
	def down
		drop_table :sets
	end
end
