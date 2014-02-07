class Restaurant < ActiveRecord::Base
validates :city, :state, :zipcode, :country, :contact1, :email, :password, :presence=>true #, :on => [:create]
has_attached_file :photo,
     :styles => {
       :medium => "300X300",
       :profile=> "137x137",
       :thumb=> "100x100#",
       :small  => "50x80>" },
       :url  => '/system/:class/:id/:style/:photo',
                             :path => ":rails_root/public/system/:class/:id/:style/:photo"
       
       
has_one :businessclaim
end
