class User < ActiveRecord::Base
  has_attached_file :avatar, :styles      => { :thumb => "16x16!", :small => "40x40!", :medium => "50x50!", :large => "214x214!" }, 
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
  validates_presence_of         :gender, :height, :weight,   :if => Proc.new { |u| u.status != 'step_one' }
  validates_inclusion_of        :gender,   :in => ['male', 'female'], :if => Proc.new { |u| u.status != 'step_one' }, :message => 'please select'
  validates_presence_of         :password, :if => Proc.new { |u| u.password_confirmation.present? }
  validates_confirmation_of     :password, :if => Proc.new { |u| u.password_confirmation.present? }
  validates_uniqueness_of       :email, :username
  validates_confirmation_of     :email
  validates_length_of           :email,    :in => 6..100
  validates_length_of           :username, :in => 4..25
  validates_attachment_presence :avatar, :if => Proc.new { |u| !['step_one'].include?(u.status) }
  
  # Callbacks
  before_save :strip_lbs
  
  # Defaults
  default_values :status => "step_one"
  
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
end
