class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
          t.integer :notificationable_id

      t.string  :notification_type
      t.string :notificationFrequency
      t.date :nextrundate
		t.string :duration
      t.string :mealslist          
      t.string :exerciseslist          
      t.string :amount          
      t.string :do_dont, :default => 0          
    	t.string :time
      t.string  :notificationable_type
      t.string :notificationTo
      t.string :notificationToId      
      t.string :message
      t.string :inactivityDays
      t.date   :notificationDuration
      t.string :frequency_type
      t.string :workoutduration   
      t.string :food_category   
      t.timestamps
    end
  end
end
