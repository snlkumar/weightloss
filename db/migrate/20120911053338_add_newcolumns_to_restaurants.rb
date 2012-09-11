class AddNewcolumnsToRestaurants < ActiveRecord::Migration
  def change
    add_column :restaurants, :vendor_name, :string
  	 add_column :restaurants, :vendor_type, :string
  	 add_column :restaurants, :country, :string
  	 add_column :restaurants, :contact1, :string
  	 add_column :restaurants, :contact2, :string
  	 add_column :restaurants, :biography, :string
  	 add_column :restaurants, :website_address, :string  	 
  	 add_column :restaurants, :email, :string
    add_column :restaurants, :fname, :string
    add_column :restaurants, :lname, :string
    add_column :restaurants, :password, :string
  	 add_column :restaurants, :school, :string    
    add_column :restaurants, :degrees, :string
    add_column :restaurants, :certifications, :string
    add_column :restaurants, :specialities, :string    
    add_column :restaurants, :licence_no, :string    
    add_column :restaurants, :licence_states, :string
    add_column :restaurants, :cost, :float
    add_column :restaurants, :average_cost, :float
    add_column :restaurants, :accept_credit_card, :string
	 add_column :restaurants, :insurance, :string                
    add_column :restaurants, :year_school, :string
    add_column :restaurants, :accept_cash, :string
    add_column :restaurants, :accept_check, :string
    add_column :restaurants, :payment_plans, :string
    add_column :restaurants, :work_hour, :string
    add_column :restaurants, :p_address, :string
    add_column :restaurants, :p_city, :string
    add_column :restaurants, :p_state, :string
    add_column :restaurants, :p_cell, :string
    add_column :restaurants, :p_contact, :string
    add_column :restaurants, :b_email, :string
    add_column :restaurants, :p_country, :string
    
  end
end
