class CreateBodyfats < ActiveRecord::Migration
  def change
    create_table :bodyfats do |t|
      t.integer :user_id
      t.float :bodyfat
      t.float :height
		t.float :waist
		t.float :neck
		t.float :hips
      t.timestamps
    end
  end
end
