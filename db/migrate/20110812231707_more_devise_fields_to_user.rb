class MoreDeviseFieldsToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :sign_in_count, :integer, :default => 0 rescue nil
    add_column :users, :current_sign_in_at, :datetime rescue nil
    add_column :users, :last_sign_in_at, :datetime rescue nil
    add_column :users, :current_sign_in_ip, :string rescue nil
  end

  def self.down
    remove_column :users, :last_sign_in_at rescue nil
    remove_column :users, :current_sign_in_ip rescue nil
    remove_column :users, :current_sign_in_at rescue nil
    remove_column :users, :sign_in_count rescue nil
  end
end