class Vendormember < ActiveRecord::Base
  belongs_to :vendor
  belongs_to :user

validates_uniqueness_of :user_id, :scope => :vendor_id 
  
end
