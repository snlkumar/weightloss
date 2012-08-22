class Vendor < ActiveRecord::Base
  validates_presence_of :vendor_type, :vendor_name, :city, :state, :zipcode, :country, :contact1, :email	
   #paperclip
  has_attached_file :photo,
     :styles => {
       :thumb=> "100x100#",
       :small  => "50x80>" }
end
