class AddFieldnameToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :fname, :string
    add_column :vendors, :lname, :string
    add_column :vendors, :password, :string
    add_column :vendors, :degrees, :string
    add_column :vendors, :year_school, :string
    add_column :vendors, :accept_cash, :string
    add_column :vendors, :accept_check, :string
    add_column :vendors, :payment_plans, :string
    add_column :vendors, :work_hour, :string
    add_column :vendors, :p_address, :string
    add_column :vendors, :p_city, :string
    add_column :vendors, :p_state, :string
    add_column :vendors, :p_cell, :string
    add_column :vendors, :p_contact, :string
    add_column :vendors, :b_email, :string
    add_column :vendors, :p_country, :string 
  end
end
