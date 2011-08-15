class AddLastSignInIpToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :last_sign_in_ip, :string rescue nil
  end

  def self.down
    remove_column :users, :last_sign_in_ip rescue nil
  end
end
