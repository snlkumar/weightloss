class User < ActiveRecord::Base
  acts_as_authentic do |c|
    c.login_field = 'email'
  end
  
  has_attached_file :avatar, :styles      => { :large => "50x50!" }, 
                             :url         => "/system/:class/:attachment/:id/:style/:filename"
  
  # Validations
  validates_presence_of     :first_name, :last_name, :email, :username
  validates_presence_of     :gender, :height, :weight,   :if => Proc.new { |u| u.status != 'step_one' }
  validates_inclusion_of    :gender,   :in => ['male', 'female'], :if => Proc.new { |u| u.status != 'step_one' }, :message => 'please select'
  validates_presence_of     :password, :if => Proc.new { |u| u.password_confirmation.present? }
  validates_confirmation_of :password, :if => Proc.new { |u| u.password_confirmation.present? }
  validates_uniqueness_of   :email, :username
  validates_confirmation_of :email
  validates_length_of       :email, :in => 6..100
  validates_attachment_presence :avatar, :if => Proc.new { |u| !['step_one'].include?(u.status) }
  
  default_values :status => "step_one"
  
  def full_name
    "#{self.first_name} #{self.last_name}"
  end
end
