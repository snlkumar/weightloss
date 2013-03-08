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


  attr_writer :current_step 
      
  def business?  
    current_step == "business"  
  end  
    

  def profile?  
    current_step == "profile"  
  end  


	def all_valid?  
		steps.all? do |step|  
		self.current_step = step  
		valid?  
		end  
	end  


  def current_step  
    @current_step || steps.first  
  end  
    

  def steps  
    %w[business profile]  
  end  


	def first_step?  
	  current_step == steps.first  
	end 


    def next_step  
      self.current_step = steps[steps.index(current_step)+1]  
    end  


    def last_step?  
      current_step == steps.last  
    end  


end
