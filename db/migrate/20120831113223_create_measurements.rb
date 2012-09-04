class CreateMeasurements < ActiveRecord::Migration
  def change
  create_table :measurements do |t|
      t.float :height
      t.float :chest
      t.float :uparmright
      t.float :forearmright
      t.float :hips
      t.float :thighright
      t.float :calfright
      t.float :calfleft
      t.float :thighleft
      t.float :waist
      t.float :forearmleft
      t.float :uparmleft
      t.float :neck
      t.integer :user_id

      t.timestamps
    end
  end
end
