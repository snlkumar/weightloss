class MealItem < ActiveRecord::Base
  attr_accessor :serving_whole, :serving_part
  
# Associations
  belongs_to :meal
  belongs_to :food
  
# Callbacks
  before_save :determine_quantity, :calculate_calories
  
# Instance Methods
  def determine_quantity
    self.serving = self.serving_whole.to_f + serving_part.to_f
  end
  
  def calculate_calories
    if food.custom?
      self.calories = food.energ_kcal * self.serving
    else
      energ_kcal          = food.energ_kcal
      weight_for_quantity = self.units.blank? ? 0 : (food.gmwt_desc1.eql?(self.units) ? food.gmwt_1 : food.gmwt_2)
      self.calories       = (energ_kcal * (weight_for_quantity * serving) / 100)
    end
  end
  
end
