class AddHomepageFlagToPosts < ActiveRecord::Migration
  def self.up
    add_column :posts, :homepage, :boolean
  end

  def self.down
    remove_column :posts, :homepage
  end
end