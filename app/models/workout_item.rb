class WorkoutItem < ActiveRecord::Base
  
# Associations
  belongs_to :workout
  belongs_to :exercise

# Callbacks
  before_save :calculate_calories

# Instance Methods
  def after_initialize
    calculate_calories
  end

  def calculate_calories
    # mets          = exercise.mets
    # weight_for_quantity = self.units.blank? ? 0 : (food.gmwt_desc1.eql?(self.units) ? food.gmwt_1 : food.gmwt_2)
    #     self.calories       = (energ_kcal * (weight_for_quantity * serving) / 100)
    self.calories = 123
  end
end
