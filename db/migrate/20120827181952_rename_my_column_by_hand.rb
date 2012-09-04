class RenameMyColumnByHand < ActiveRecord::Migration
def self.up
    rename_column :restaurants, :name, :business_name
	 rename_column :restaurants, :address, :address1
	 rename_column :restaurants, :zip, :zipcode
  end

end
