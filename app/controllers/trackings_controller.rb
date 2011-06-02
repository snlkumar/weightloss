class TrackingsController < ApplicationController
  layout 'tracking'
  
  before_filter :require_user
  
  def show
    
    render
  end
  
  def charts
    
  end
end
