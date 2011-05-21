class User < ActiveRecord::Base
  BMR_MULTIPLIERS = [1.2, 1.375, 1.55, 1.725, 1.9]
  
  has_attached_file :avatar, :styles      => { :thumb   => "16x16!",   :small => "40x40!", :medium => "50x50!", 
                                               :profile => '137x137!', :large => "214x214!" }, 
                             :url         => "/system/:class/:attachment/:id/:style/:filename"
  
  # Auth Logic
  acts_as_authentic do |config|
    config.login_field = 'email'
    config.merge_validates_length_of_password_confirmation_field_options :minimum => 6
    config.merge_validates_length_of_password_field_options              :minimum => 6
  end
  
  # Associations
  has_many :meals
  has_many :workouts
  
  # Validations
  validates_presence_of         :first_name, :last_name, :email, :username
  validates_presence_of         :gender, :height, :weight,            :if => Proc.new { |u| u.status != 'step_one' }
  validates_inclusion_of        :gender, :in => ['male', 'female'],   :if => Proc.new { |u| u.status != 'step_one' }, :message => 'please select'
  validates_presence_of         :password,                            :if => Proc.new { |u| u.password_confirmation.present? }
  validates_confirmation_of     :password,                            :if => Proc.new { |u| u.password_confirmation.present? }
  validates_attachment_presence :avatar,                              :if => Proc.new { |u| !['step_one'].include?(u.status) }
  validates_uniqueness_of       :email, :username
  validates_confirmation_of     :email
  validates_length_of           :email,    :in => 6..100
  validates_length_of           :username, :in => 4..25
  
  # Callbacks
  before_save :strip_lbs
  
  # Defaults
  default_values :status => "step_one"
  
  # Instance Methods
  
  def full_name
    "#{self.first_name} #{self.last_name}"
  end
  
  def strip_lbs
    if self.weight.is_a?(String) && self.weight.match(/lbs/)
      self.weight = self.weight.gsub('lbs', '').to_i
    end
  end
  
  def age
    temp = Time.zone.now.year - birthdate.year
    temp -= 1 if Time.zone.now < birthdate + temp.years
  end
  
  def weight_in_kilograms
    (self.weight.to_i * 0.4535).round(2)
  end
  
  def height_in_centimeters
    (self.height.to_i * 2.54).round(2)
  end
  
  def calculate_metabolic_rates()
    if self.male?
      self.bmr = ((13.75 * weight_in_kilograms) + (5 * height_in_centimeters) - (6.76 * age) + 66) * BMR_MULTIPLIERS[self.activity_level - 1]
      self.rmr = (10 * weight_in_kilograms) + (6.25 * height_in_centimeters) - (5 * age) + 5
    else
      self.bmr = ((9.56 * weight_in_kilograms) + (1.85 * height_in_centimeters) - (4.68 * age) + 655)  * BMR_MULTIPLIERS[self.activity_level - 1]
      self.rmr = (10 * weight_in_kilograms) + (6.25 * height_in_centimeters) - (5 * age) - 161
    end
  end
  
  def male?
    self.gender == 'male'
  end
  
  def calories_consumed_today
    self.meals.today.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += meal_item.calories } }
  end
  
  def calories_burned_today
    self.workouts.today.inject(0) do |tot, workout| 
      tot += workout.workout_items.inject(0) do |workout_tot, workout_item| 
        workout_tot += workout_item.calories
      end
    end
  end
  
  def calories_consumed_this_week
    self.meals.past_week.inject(0) do |tot, meal|
      tot += meal.meal_items.inject(0) do | meal_tot, meal_item|
        meal_tot += meal_item.calories
      end
    end
  end
  
  def calories_burned_this_week
    self.workouts.past_week.inject(0) do |tot, workout| 
      tot += workout.workout_items.inject(0) do |workout_tot, workout_item| 
        workout_tot += workout_item.calories 
      end
    end
  end
  
  
  
  # CLass Methods  
end
