class AddPrivateToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :private, :boolean
  end

  def self.down
    remove_column :users, :private
  end
end
