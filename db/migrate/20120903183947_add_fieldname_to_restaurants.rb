class AddFieldnameToRestaurants < ActiveRecord::Migration
  def change
    add_column :restaurants, :status, :string
  end
end
