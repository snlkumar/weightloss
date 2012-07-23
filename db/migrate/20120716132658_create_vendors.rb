class CreateVendors < ActiveRecord::Migration
  def change
    create_table :vendors do |t|
      t.string :vendor_type
      t.string :title
      t.string :company_title
      t.string :vendor_name
      t.string :address1
      t.string :address2
      t.string :city
      t.string :state
      t.string :zipcode
      t.string :country
      t.string :contact1
      t.string :contact2
      t.string :email
      t.string :website_address
      t.string :custom_field1
      t.string :custom_field2
      t.string :custom_field3
      t.string :custom_field4
      t.timestamps
    end
  end
  
  def down
    drop_table :vendors
  end
end
