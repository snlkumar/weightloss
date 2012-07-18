class MealItem < ActiveRecord::Base
  attr_accessor :serving_whole, :serving_part
  
# Associations
  belongs_to :meal
  belongs_to :food
  
# Callbacks
  before_save :determine_quantity, :calculate_calories
  
# Instance Methods
  def determine_quantity
    #self.serving = self.serving_whole.to_f + serving_part.to_f
  end
  
  def calculate_calories
		if calories.blank?
		  if food and food.custom?
		    self.calories = food.energ_kcal* self.serving
		  else
		    energ_kcal          = food.energ_kcal
		    
				unit_desc = self.serving.to_s.gsub(".0","").gsub("0.",".") + self.units
		 		
		    weight_for_quantity = self.units.blank?  ? 0 : (food.gmwt_desc1.eql?(unit_desc) ? food.gmwt_1 : (food.gmwt_2.blank?  ? 0 : food.gmwt_2 ))
		    
		    self.calories       = (energ_kcal * (weight_for_quantity * self.serving) / 100)
		 end
		 
		end  
end 

  def prettify(n)
    n.to_i == n ? n.to_i : n
  end

end
