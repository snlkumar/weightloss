class TrackingsController < ApplicationController
  layout 'tracking'
  
  before_filter :authenticate_user!
  
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

  def bodyfat_over_time
    @user  = current_user
    @range = params[:range]
    @grapher = BodyfatGrapher.new( @range, current_user )
  end

  def measurement_over_time
 @user  = current_user
 @range = params[:range]
 @grapher = MeasurementGrapher.new( @range, current_user )
            
  end
	
end
