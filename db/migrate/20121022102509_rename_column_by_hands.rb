class RenameColumnByHands < ActiveRecord::Migration
  def self.up
    rename_column :vendors, :business_name, :business_name1

  end

end
