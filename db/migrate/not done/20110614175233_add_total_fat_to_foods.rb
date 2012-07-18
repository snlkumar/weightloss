class AddTotalFatToFoods < ActiveRecord::Migration
  def self.up
    add_column :foods, :total_fat, :decimal, :precision => 6, :scale => 1
  end

  def self.down
    remove_column :foods, :total_fat
  end
end