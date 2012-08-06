class AddFieldnameToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :status, :string
    add_column :vendors, :reason, :string
  end
end
