class Vendor < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable


  # Setup accessible (or protected) attributes for your model
#  attr_accessible :email, :password, :password_confirmation, :remember_me,:business_name
#validates :city, :state, :zipcode, :country, :contact1, :email, :password, :presence=>true, :on => [:create]
   #paperclip
  has_many :vendormembers
  has_many :users, :through => :vendormembers   
  has_many :ratings, :as => :ratingable
  has_many :notifications, :as => :notificationable  
  has_attached_file :photo,
     :styles => {
       :medium => "300X300",
       :profile=> "137x137",
       :thumb=> "100x100#",
       :small  => "15x30" },
       :url  => '/system/:class/:id/:style/:photo',
                             :path => ":rails_root/public/system/:class/:id/:style/:photo"
  has_one :businessclaim

  validates_presence_of :business_name, :email, :password, :zipcode, :presence=>true, :on => [:create] 
# validates_presence_of :city, :state,  :country, :contact1,:presence=>true, :on => [:create], :if => :profile? 

 
#vendor registration form methods

def to_param
  "#{id}-#{business_name}".downcase.gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").strip
end



end
