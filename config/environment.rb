# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Myweightworld::Application.initialize!

 require 'iconv'
 
 ActionMailer::Base.smtp_settings = {
  :user_name => "myww",
  :password => "myww1234",
  :domain => "myweightworld.com",
  :address => "smtp.sendgrid.net",
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true
}
 
 
