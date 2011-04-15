class Admin::BaseController < ApplicationController
  before_filter :require_admin
  
  layout 'tracking'
  
  def show
    
  end
end
