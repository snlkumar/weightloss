class CreateMywwnotifications < ActiveRecord::Migration
  def change
    create_table :mywwnotifications do |t|
      t.string  :lunch
      t.string :dinner
      t.string  :breakfast
      t.string  :goal
      t.integer  :user_id
      t.timestamps
    end
  end
end
