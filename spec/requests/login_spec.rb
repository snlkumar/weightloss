require 'spec_helper'

describe "Login" do
  describe "GET /" do
    before do
      @user = Factory.create(:user)
    end
    
    it "should let you get to the login page" do
      visit root_path
      page.should have_content("Sign in")
    end
  end
end
