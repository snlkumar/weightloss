# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.12' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  # Settings in config/environments/* take precedence over those specified here.
  # Application configuration should go into files in config/initializers
  # -- all .rb files in that directory are automatically loaded.
  
  # Add additional load paths for your own custom dirs
  # config.autoload_paths += %W( #{RAILS_ROOT}/extras )
  
  
  
  # Activate observers that should always be running
  # config.active_record.observers = :cacher, :garbage_collector, :forum_observer
  
  # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
  # Run "rake -D time" for a list of tasks for finding time zone names.
  config.time_zone = 'Arizona'
  
  # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
  # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}')]
  # config.i18n.default_locale = :de
  
  # config.action_view.sanitized_allowed_attributes = "target"
  config.action_view.sanitized_allowed_tags       = 'b', 'ol', 'ul', 'li', 'em', 'i', 'strong', 'p', 'br', 'a', 'blockquote', 'caption', 'cite', 'code', 'dl', 'dt', 'dd', 'img', 'pre', 'q', 'small', 'strike', 'param', 'embed', 'object', 'sub', 'sup', 'u'
end

ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
  unless html_tag.match(/type=\"hidden\"/)
    error_class = "fieldError"
    if html_tag =~ /<(input|textarea|select)[^>]+class=/
      style_attribute = html_tag =~ /class=['"]/
      html_tag.insert(style_attribute + 7, "#{error_class} ")
    elsif html_tag =~ /<(input|textarea|select)/
      first_whitespace = html_tag =~ /\s/
      html_tag[first_whitespace] = " class='#{error_class}' "
    end
  end
  html_tag
end