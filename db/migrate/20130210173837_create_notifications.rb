class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
          t.integer :notificationable_id
      t.string  :notificationable_type
      t.string :notificationTo
      t.string :notificationToId      
      t.string :message
      t.integer :hideNotification, :default => 0
      t.timestamps
    end
  end
end
