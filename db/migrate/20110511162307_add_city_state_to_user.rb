class AddCityStateToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :city, :string
    add_column :users, :state, :string
  end

  def self.down
    remove_column :users, :state
    remove_column :users, :city
  end
end
