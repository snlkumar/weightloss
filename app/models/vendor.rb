class Vendor < ActiveRecord::Base
 validates_presence_of :city, :state, :zipcode, :country, :contact1, :email, :password, :only => [:create, :new, :edit, :update]
   #paperclip
  has_attached_file :photo,
     :styles => {
       :medium => "300X300",
       :profile=> "137x137",
       :thumb=> "100x100#",
       :small  => "50x80>" }
  has_one :businessclaim
end
