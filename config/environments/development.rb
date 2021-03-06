Myweightworld::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false
  config.action_mailer.default_url_options = { :host => 'localhost:3002' }
  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = true

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin
  
#  config.action_mailer.default_url_options = { :host => 'localhost:3000' }

#  config.middleware.use ExceptionNotifier,	
#  :email_prefix => "notifier",	
 # :sender_address => %{"notifier" <harish@idifysolutions.com>},
#  :exception_recipients => "jony@idifysolutions.com"

  
 ActionMailer::Base.delivery_method = :smtp
 ActionMailer::Base.smtp_settings = {
 :address              => "smtp.gmail.com",
 :port                 => 587,
 :domain               => "gmail.com",
 :user_name            => "harish@idifysolutions.com" ,
 :password             => "Harry_Harsh",
 :authentication       => "plain",
 :enable_starttls_auto => true
 }
 
 #You may also change the default email message format. If you prefer to send email in HTML instead of plain text format,
 # add the following line to config/environment.rb as well:
#ActionMailer::Base.default_content_type = "text/html"

#ActionMailer::Base.default_content_type could be set to "text/plain", "text/html", and "text/enriched". 
# The default value is "text/plain".
end

