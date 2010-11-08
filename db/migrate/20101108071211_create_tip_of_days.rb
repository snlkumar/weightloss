class CreateTipOfDays < ActiveRecord::Migration
  def self.up
    create_table :tip_of_days do |t|
      t.string :title
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :tip_of_days
  end
end
