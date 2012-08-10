class Vendor < ActiveRecord::Base
  validates_presence_of :vendor_type, :vendor_name, :city, :state, :zipcode, :country, :contact1, :email	
 
end
