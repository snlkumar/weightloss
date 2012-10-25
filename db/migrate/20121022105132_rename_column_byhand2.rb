class RenameColumnByhand2 < ActiveRecord::Migration
  def self.up
    rename_column :vendors, :business_name1, :vendor_name

  end

end
