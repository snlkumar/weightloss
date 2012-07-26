class AddColumnDetailedToFood < ActiveRecord::Migration
  def change
    add_column :foods, :detailes, :text
  end
  def down
    remove_column :foods, :detailes
  end
end
