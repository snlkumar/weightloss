class AddColumnDetailedToFood < ActiveRecord::Migration
  def change
    add_column :foods, :detailed, :text
  end
  def down
    remove_column :foods, :detailed
  end
end
