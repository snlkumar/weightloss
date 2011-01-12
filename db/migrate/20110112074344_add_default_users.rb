class AddDefaultUsers < ActiveRecord::Migration
  def self.up
    User.create :first_name => 'Normal', :last_name => 'User', :email => 'user@example.com', :username => 'TestGuy',
                :gender => 'Male', :height => "6'1", :weight => 220, :password => 'password', :password_confirmation => 'password'
  end

  def self.down
    User.find_by_username('normal').try :destroy
  end
end
