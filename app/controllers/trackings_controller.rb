class TrackingsController < ApplicationController
  before_filter :require_user
  
  def show
    
    render :layout => "tracking"
  end
end
