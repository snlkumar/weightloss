class Food < ActiveRecord::Base


#using in admin food edit to categories food........

Food_Category=['Gluten Free', 'Low Carb', 'High Carb', 'Medium Carb', 'Protein', 'Good Fat', 'Bad Fat', 'Vegetables', 'Fruit', 'Paleo', 'Red Meat', 'Seafood', 'Chicken', 'Turkey', 'Lamb', 'Kosher', 'Low fat', 'Low Sugar', 'Vegan', 'Raw Vegan', 'Dairy', 'Nut Free', 'Healthy', 'Bad Food', 'Good Food', 'Supplements', 'Protein Powder', 'Bars', 'High Cholesterol', 'Low Calorie', 'Low Sodium', 'Fat','Healthy','Snacks','Breakfast','High Sugar','Vegetarian']




  #scope :with_a_serving_size, :conditions => "gmwt_desc1 is NOT NULL OR gmwt_desc2 is NOT NULL"
  scope :with_a_serving_size, :conditions => "(gmwt_desc1 is NOT NULL OR gmwt_1 is NOT NULL) and gmwt_desc1!=''" #OR gmwt_desc2 is NOT NULL"
  has_friendly_id :name, :use_slug => true
  
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
