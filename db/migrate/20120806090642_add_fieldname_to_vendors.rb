class AddFieldnameToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :status, :string
    add_column :vendors, :reason, :string
    add_column :vendors, :business_name, :string 
    add_column :vendors, :biography, :string 
    add_column :vendors, :cost, :float 
    add_column :vendors, :average_cost, :float 
    add_column :vendors, :accept_credit_card, :string 
    add_column :vendors, :accept_insurance, :string 
    add_column :vendors, :qualifications, :float 
    add_column :vendors, :certifications, :string 
    add_column :vendors, :school, :string 
    add_column :vendors, :year_graduated, :integer 
    add_column :vendors, :licence_no, :string 
    add_column :vendors, :specialities, :string 
    add_column :vendors, :age, :string 
    add_column :vendors, :gender, :string
    add_column :vendors, :year, :string 
    add_column :vendors, :license_states, :string

  end

end

