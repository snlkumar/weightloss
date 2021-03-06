class WorkoutItem < ActiveRecord::Base
# Associations
  belongs_to :workout
  belongs_to :exercise
  belongs_to :user
  #has_many :sets,  :dependent => :destroy
# Callbacks
  before_save :calculate_calories
  
# Instance Methods
  def after_initialize
    calculate_calories
  end
  
  def calculate_calories
		if calories.blank?
			if exercise.mets!=nil
				mets                = exercise.mets 
			else
					mets=0
			end
		  #mets                = exercise.mets
		  weight_in_kilograms = (self.user ? self.user.weight : User.find(self.user_id).weight ) * 0.45
		  self.calories       = self.duration * ((mets * 3.5 * weight_in_kilograms)/200)
		end
  end
end
