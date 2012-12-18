class AddPartNumberToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :city2, :string
    add_column :vendors, :city3, :string
    add_column :vendors, :state2, :string
    add_column :vendors, :state3, :string
    add_column :vendors, :contact3, :string
    add_column :vendors, :contact4, :string
    add_column :vendors, :contact5, :string
    add_column :vendors, :contact6, :string
    add_column :vendors, :certifications2, :string
    add_column :vendors, :certifications3, :string
    add_column :vendors, :specialities2, :string
    add_column :vendors, :specialities3, :string
    add_column :vendors, :licence_no1, :string
    add_column :vendors, :licence_no2, :string
    add_column :vendors, :license_states1, :string
    add_column :vendors, :license_states2, :string

    add_column :restaurants, :city2, :string
    add_column :restaurants, :city3, :string
    add_column :restaurants, :state2, :string
    add_column :restaurants, :state3, :string
    add_column :restaurants, :contact3, :string
    add_column :restaurants, :contact4, :string
    add_column :restaurants, :contact5, :string
    add_column :restaurants, :contact6, :string
    add_column :restaurants, :certifications2, :string
    add_column :restaurants, :certifications3, :string
    add_column :restaurants, :specialities2, :string
    add_column :restaurants, :specialities3, :string
    add_column :restaurants, :licence_no1, :string
    add_column :restaurants, :licence_no2, :string
    add_column :restaurants, :license_states1, :string
    add_column :restaurants, :license_states2, :string

  end
end
