class CreateMeals < ActiveRecord::Migration
  def self.up
    create_table :meals do |t|
      t.belongs_to :user
      
      t.datetime :ate_on
      t.text     :note
      
      t.timestamps
    end
  end

  def self.down
    drop_table :meals
  end
end
