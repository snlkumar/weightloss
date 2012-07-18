# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run Myweightworld::Application

# Myweightworld::Application.config.middleware.use ExceptionNotifier,
#  :email_prefix => "notifier ",
#  :sender_address => %{"notifier" <harish@idifysolutions.com>},
#  :exception_recipients => %w{harish@idifysolutions.com}
