class TrackingsController < ApplicationController
  layout 'tracking'
  
  before_filter :require_user
  
  def show
    @user = current_user
    render
  end
  
  def charts
    @user = current_user
  end
end
