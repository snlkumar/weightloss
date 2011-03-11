class Meal < ActiveRecord::Base
  QUANTITY_WHOLE = (0..10).map{|i| [i, i] }
  QUANTITY_PARTS = [['.0', 0], ['.25', 0.25], ['.5', 0.5], ['.75', 0.75]]
  UNITS          = ['teaspoon', 'tablespoon', 'cup', 'ounce', 'pound']
  TYPES          = ['Snack', 'Breakfast', 'Lunch', 'Dinner']
  
  # Associations
  belongs_to :user
  
  has_many :meal_items, :dependent => :destroy
  has_many :foods,      :through => :meal_items
  
  # Scopes
  named_scope :starting_from, lambda { |date| {:conditions => ["ate_on <= date", date]}}
  
  # Nested Attributes
  accepts_nested_attributes_for :meal_items, :allow_destroy => true
end
