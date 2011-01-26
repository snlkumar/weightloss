class AddDefaultUsers < ActiveRecord::Migration
  def self.up
    if Rails.env.production?
      User.create :first_name => 'Normal', :last_name => 'User', :email => 'user@example.com', :username => 'TestGuy',
                  :gender => 'Male', :height => 72, :weight => 200, :password => 'password', :password_confirmation => 'password'
    end
  end

  def self.down
    User.find_by_username('normal').try :destroy
  end
end
