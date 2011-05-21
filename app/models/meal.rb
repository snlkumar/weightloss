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
  named_scope :starting_from, lambda { |date| {:conditions => ["ate_on <= ?", date] }}
  named_scope :on,            lambda { |date| {:conditions => ["ate_on >= ? AND ate_on <= ?", date.beginning_of_day, date.end_of_day], 
                                               :order => "ate_on ASC"} }
  named_scope :today,     :conditions => ["ate_on >= ? AND ate_on <= ?", Time.zone.today.beginning_of_day, Time.zone.today.end_of_day]
  named_scope :past_week, :conditions => ["ate_on >= ?", 6.days.ago]
  
# Nested Attributes
  accepts_nested_attributes_for :meal_items, :allow_destroy => true
  
# Instance Methods
  def ate_on_date=(hash)
    self.ate_on = Time.zone.parse("#{hash[:date]} #{hash[:time][:hour]}:#{hash[:time][:minute]} #{hash[:time][:meridian]}")
  end
  
  def total_calories
    meal_items.inject(0){|memo, meal_item| memo += meal_item.calories }
  end
end

