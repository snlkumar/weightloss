class Food < ActiveRecord::Base
  scope :with_a_serving_size, :conditions => "gmwt_desc1 is NOT NULL OR gmwt_desc2 is NOT NULL"
  
  validates_presence_of :name
  validates_uniqueness_of :name
  
  validate :calories_and_serving
  
  def calories_and_serving
    if self.custom?
      self.errors.add_to_base("Serving size cannot be blank.") if self.gmwt_desc1.blank?
      self.errors.add_to_base("Calories cannot be blank.") if self.energ_kcal.blank?
    end
  end
end
