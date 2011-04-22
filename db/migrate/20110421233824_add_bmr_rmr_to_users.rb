class AddBmrRmrToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :rmr, :integer
    add_column :users, :bmr, :integer
  end

  def self.down
    remove_column :users, :bmr
    remove_column :users, :rmr
  end
end
