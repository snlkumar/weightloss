class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable, :lockable, :timeoutable
#validates :password, :presence => true, :length => { :minimum => 6 }

    has_friendly_id :full_name, :use_slug => true
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  attr_accessor :remove_avatar, :current_password
  
  BMR_MULTIPLIERS = [1.2, 1.375, 1.55, 1.725, 1.9]
  
  Paperclip.interpolates :normalized_avatar_name do |attachment, style|
    attachment.instance.normalized_avatar_file_name
  end
  
  has_attached_file :avatar, :styles      => { :thumb   => "16x16#",   :small => "40x40#", :medium => "50x50#", :tracking => "78x78#",
                                               :profile => '137x137#', :large => "214x214#" }, 
                             :url  => '/system/:class/:attachment/:id/:style/:normalized_avatar_name',
                             :path => ":rails_root/public/system/:class/:attachment/:id/:style/:normalized_avatar_name"

                             
#new code add photo after and before of measurement
has_attached_file :photobefore, :styles      => { :thumb   => "16x16#",  :medium => "50x50#", :large => "214x214#" }, 
                             :url  => '/system/:class/:attachment/:id/:style/:filename',
                             :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename"

has_attached_file :photoafter, :styles      => { :thumb   => "16x16#", :medium => "50x50#", :large => "214x214#" }, 
                             :url  => '/system/:class/:attachment/:id/:style/:filename',
                             :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename"

#### end new code for photo



  
  # Associations
  has_many :meals,    :dependent => :destroy
  has_many :workouts, :dependent => :destroy
  has_many :weights,  :dependent => :destroy, :order => 'created_at DESC'
  
  # Scopes
  scope :recent, :conditions => {:status => 'finalize'}, :order => 'created_at DESC', :limit => 7
  
  # Validations
  # validates_presence_of         :first_name, :last_name, :email, :username
  #   validates_presence_of         :gender, :height, :weight,            :if => Proc.new { |u| u.status != 'step_one' }
  #   validates_inclusion_of        :gender, :in => ['male', 'female'],   :if => Proc.new { |u| u.status != 'step_one' }, :message => 'please select'
  #   validates_attachment_presence :avatar,                              :if => Proc.new { |u| !['step_one'].include?(u.status) }
  #   validates_uniqueness_of       :email, :username
  #   validates_confirmation_of     :email
  #   validates_length_of           :email,    :in => 6..100
  #   validates_length_of           :username, :in => 4..25
  
  # Callbacks
  before_save :strip_lbs
  
  # Defaults
  default_values :status => "step_one", :private => false
  
  # Instance Methods
  def normalized_avatar_file_name
    return transliterate(self.avatar_file_name)
  end
  
  def has_goal?
    !self.desired_weight.blank?
  end
  
  def weight
    self.weights.first.try(:weight)
  end
  
  def weight=(val)
    if Weight.exists?(:user_id => self.id, :created_at => (Time.zone.now.beginning_of_day..Time.zone.now.end_of_day))
      temp = self.weights.find(:first, :conditions => {:created_at => (Time.zone.now.beginning_of_day..Time.zone.now.end_of_day)})
      temp.update_attribute(:weight, val)
    else
      self.weights.create(:weight => val) unless self.new_record?
    end
  end
  
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
    temp
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
  
  def female?
    !self.male?
  end
  
  def calories_consumed_today
    cc=self.meals.today.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += meal_item.calories } }
    
   
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
  
  def total_calories_burned_on(day)
    return 0 if self.workouts.on(day).empty?
    self.workouts.on(day).inject(0){|sum, wout| sum += wout.total_calories }
  end
  
  def total_calories_consumed_on(day)
    return 0 if self.meals.on(day).empty?
    self.meals.on(day).inject(0){|sum, meal| sum += meal.total_calories }
  end
  
  def net_calories_on(day)
    total_calories_consumed_on(day) - total_calories_burned_on(day)
  end
  
  def remove_avatar=(value)
    self.avatar = nil if value == '1'
  end
  
  def trying_to_lose_weight?
    return false if self.desired_weight.nil?
    self.desired_weight < self.weight
  end
  
  def public?
    !self.private?
  end
  
  def update_with_password(params={})
    current_password = params.delete(:current_password) if !params[:current_password].blank?

    if params[:password].blank?
      params.delete(:password)
      params.delete(:password_confirmation) if params[:password_confirmation].blank?
    end

    result = if has_no_password?  || valid_password?(current_password)
      update_attributes(params) 
    else
      self.errors.add(:current_password, current_password.blank? ? :blank : :invalid)
      self.attributes = params
      false
    end

    clean_up_passwords
    result
  end

  def has_no_password?
    self.encrypted_password.blank?
  end
  
  def to_s
    self.full_name
  end
  
  # CLass Methods  
  def self.find_for_facebook_oauth(access_token, signed_in_resource=nil)
    data = access_token['extra']['user_hash']
    Rails.logger.error("FACEBOOK DATA: #{data.inspect}")
    Rails.logger.error("EXTRA: #{access_token['extra'].inspect}")
    
    if user = User.find_by_email(data["email"])
      user
    # else # Create a user with a stub password. 
    #       User.create(:email => data["email"], :password => Devise.friendly_token[0,20], 
    #                   :first_name => data["first_name"], :last_name => data["last_name"],
    #                   :username => data["nickname"]) 
    end
  end
  
  # Called in Devise Registrations Controller before building a resource
  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["user_info"]
        user.email      = data["email"]
        user.first_name = data["first_name"]
        user.last_name  = data["last_name"]
        user.username   = data["nickname"]
        user.facebook_uid = session["devise.facebook_data"]["uid"]
        user.facebook_token = session["devise.facebook_data"]["credentials"]["token"]
      end
    end
  end
  
  def transliterate(str)
    # Based on permalink_fu by Rick Olsen
    # Escape str by transliterating to UTF-8 with Iconv
    s = Iconv.iconv('ascii//ignore//translit', 'utf-8', str).to_s
    # Downcase string
    s.downcase!
    # Remove apostrophes so isn't changes to isnt
    s.gsub!(/'/, '')
    # Replace any non-letter or non-number character with a space
    s.gsub!(/[^A-Za-z0-9_\.]+/, ' ')
    s.strip!
    # Replace groups of spaces with single hyphen
    s.gsub!(/\ +/, '-')
    return s
  end
  
  protected
    
    
    def password_required?
      facebook_uid.blank? && super
    end

end
