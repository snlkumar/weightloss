class Meal < ActiveRecord::Base
  QUANTITY_WHOLE = (0..10).map{|i| [i, i] }
  QUANTITY_PARTS = [['0', 0], ['1/4', 0.25], ['1/2', 0.5], ['3/4', 0.75]]
  UNITS = ['teaspoon', 'tablespoon', 'cup', 'ounce', 'pound']
  
  # Associations
  belongs_to :user
  
  has_many :meal_items, :dependent => :destroy
  has_many :foods,      :through => :meal_items
  
  # Nested Attributes
  accepts_nested_attributes_for :meal_items
end
