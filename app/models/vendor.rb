class Vendor < ActiveRecord::Base
#validates :city, :state, :zipcode, :country, :contact1, :email, :password, :presence=>true, :on => [:create]
   #paperclip
has_attached_file :photo,
     :styles => {
       :medium => "300X300",
       :profile=> "137x137",
       :thumb=> "100x100#",
       :small  => "50x80>" },
       :url  => '/system/:class/:id/:style/:photo',
                             :path => ":rails_root/public/system/:class/:id/:style/:photo"
  has_one :businessclaim

  validates_presence_of :business_name, :email, :password, :zipcode, :presence=>true, :on => [:create], :if => :business?  
  validates_presence_of :city, :state,  :country, :contact1,:presence=>true, :on => [:create], :if => :profile? 

 
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
