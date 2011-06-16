class AddMoreFieldsToCustomFoods < ActiveRecord::Migration
  def self.up
    add_column :foods, :saturated_fat, :decimal, :precision => 6, :scale => 1
    add_column :foods, :trans_fat, :decimal, :precision => 6, :scale => 1
    add_column :foods, :sugar_alchol, :decimal, :precision => 6, :scale => 1
  end

  def self.down
    remove_column :foods, :sugar_alchol
    remove_column :foods, :trans_fat
    remove_column :foods, :saturated_fat
  end
end