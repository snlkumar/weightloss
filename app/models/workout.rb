class Workout < ActiveRecord::Base
  attr_accessor :trained_on_date
  
# Associations
  belongs_to :user

  has_many :workout_items,  :dependent => :destroy
  has_many :exercises,      :through => :workout_items

# Scopes
  named_scope :starting_from, lambda { |date| {:conditions => ["trained_on <= ?", date] }}
  named_scope :today, :conditions => ["trained_on >= ? AND trained_on <= ?", Time.zone.today.beginning_of_day, Time.zone.today.end_of_day]
  named_scope :past_week, :conditions => ["trained_on >= ?", 6.days.ago]

# Nested Attributes
  accepts_nested_attributes_for :workout_items, :allow_destroy => true

# Instance Methods
  def trained_on_date=(hash)
    self.trained_on, Time.zone.parse("#{hash[:date]} #{hash[:time][:hour]}:#{hash[:time][:minute]} #{hash[:time][:meridian]}")
  end

  def total_calories
    workout_items.inject(0){|memo, workout_item| memo += workout_item.calories }
  end
end
