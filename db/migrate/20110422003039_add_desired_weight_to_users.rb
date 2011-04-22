class AddDesiredWeightToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :desired_weight, :integer
  end

  def self.down
    remove_column :users, :desired_weight
  end
end
