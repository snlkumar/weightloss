class AddforempostcolumToUsers < ActiveRecord::Migration
  def up
    add_column :users, :hideForemPost, :integer, :default => 0
  end

  def down
  end
end
