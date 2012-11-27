class CreateBodyfats < ActiveRecord::Migration
  def change
    create_table :bodyfats do |t|
      t.integer :user_id		
      t.float :bodyfat
		t.float :bodymass
      t.float :chest
		t.float :midaxillary
		t.float :bicep
		t.float :abdominal
      t.float :suprailiac
		t.float :thigh
		t.float :calf
		t.float :subscapular
		t.float :tricep
	   t.float :lower_back
      t.timestamps
    end
  end
end

