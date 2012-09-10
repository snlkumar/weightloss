# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Myweightworld::Application.initialize!

 require 'iconv'
 
=begin
 ActionMailer::Base.smtp_settings = {
  :user_name => "myww",
  :password => "myww1234",
  :domain => "localhost:3001",
  :address => "smtp.sendgrid.net",
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}
=end
 
 
