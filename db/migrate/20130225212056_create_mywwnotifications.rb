class CreateMywwnotifications < ActiveRecord::Migration
  def change
    create_table :mywwnotifications do |t|
      t.string  :weight
      t.string :activity
      t.string  :food
      t.string  :supplements
      t.string  :bodyfat
      t.string :calories
      t.string  :other
      
      t.integer  :user_id
      t.timestamps
    end
  end
end
