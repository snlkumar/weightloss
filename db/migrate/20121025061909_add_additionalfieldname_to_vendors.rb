class AddAdditionalfieldnameToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :address3, :string
    add_column :restaurants, :address2, :string
    add_column :restaurants, :address3, :string
  end
end
