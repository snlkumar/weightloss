class TrackingsController < ApplicationController
  layout 'tracking'
  
  before_filter :require_user
  
  def show
    @user = current_user
    render
  end
  
  def charts
    @user  = current_user
    @range = params[:range]
  end
  
  def weight_over_time
    @user  = current_user
    @range = params[:range]
    @grapher = WeightGrapher.new( @range, current_user )
  end
  
  def net_calories
    @user  = current_user
    @range = params[:range]
    @grapher = NetCaloriesGrapher.new( @range, current_user )
  end
end
