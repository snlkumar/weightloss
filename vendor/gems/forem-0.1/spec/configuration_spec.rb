require 'spec_helper'

describe "required configuration options must be set" do
  required_options = [:user_class]
  required_options.each do |option|
    it "requires #{option} is set" do
      Forem.send("#{option}=", nil)
      call_to_method = lambda { Forem.send("#{option}") }
      call_to_method.should raise_error(Forem::ConfigurationNotFound)
      
      Forem.send("#{option}=", "not nil")
      call_to_method.should_not raise_error
    end
  end
end