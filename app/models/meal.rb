class Meal < ActiveRecord::Base
  attr_accessor :ate_on_date
  
# Constants
  QUANTITY_WHOLE = (0..10).map{|i| [i, i] }
  QUANTITY_PARTS = [['.0', 0], ['.25', 0.25], ['.5', 0.5], ['.75', 0.75]]
  UNITS          = ['teaspoon', 'tablespoon', 'cup', 'ounce', 'pound']
  TYPES          = ['Snack', 'Breakfast', 'Lunch', 'Dinner']
  
# Associations
  belongs_to :user
  
  has_many :meal_items, :dependent => :destroy
  has_many :foods,      :through => :meal_items
  
# Scopes
  named_scope :starting_from, lambda { |date| {:conditions => ["ate_on <= ?", date]}}
  
# Nested Attributes
  accepts_nested_attributes_for :meal_items, :allow_destroy => true
  
# Instance Methods
  def ate_on_date=(hash)
    write_attribute(:ate_on, Time.zone.parse("#{hash[:date]} #{hash[:time][:hour]}:#{hash[:time][:minute]} #{hash[:time][:meridian]}") )
  end
  
  def total_calories
    meal_items.inject(0){|memo, meal_item| memo += meal_item.calories }
  end
end

