class Food < ActiveRecord::Base
  #scope :with_a_serving_size, :conditions => "gmwt_desc1 is NOT NULL OR gmwt_desc2 is NOT NULL"
  scope :with_a_serving_size, :conditions => "(gmwt_desc1 is NOT NULL OR gmwt_1 is NOT NULL) and gmwt_desc1!=''" #OR gmwt_desc2 is NOT NULL"
  
validates_presence_of :name
  validates_uniqueness_of :name
  
  validate :calories_and_serving
  #new added code
  has_attached_file :avatar, :styles      => { :medium => '70x80#', :large => "290x250#" }, 
                             :url  => '/system/:class/:attachment/:id/:style/:filename',
                             :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename"
  #end code
              
  def calories_and_serving
    if self.custom?
      self.errors.add(:base, "Serving size cannot be blank.") if self.gmwt_desc1.blank?
      self.errors.add(:base, "Calories cannot be blank.") if self.energ_kcal.blank?
    end
  end
  
end
