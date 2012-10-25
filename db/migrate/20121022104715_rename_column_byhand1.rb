class RenameColumnByhand1 < ActiveRecord::Migration
def self.up
	 rename_column :vendors, :vendor_name, :business_name

  end  


end
