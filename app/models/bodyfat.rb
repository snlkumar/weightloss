class Bodyfat < ActiveRecord::Base
  belongs_to :user
  
    scope :today, :conditions => ["created_at >= ?", 2.days.ago]  
    scope :past_week, :conditions => ["created_at >= ?", 6.days.ago]
    scope :past_month, :conditions => ["created_at >= ?", 30.days.ago]   
  
end
