class MetabolicRatesController < ApplicationController
  layout 'application'
  
  before_filter :require_user
  
  def edit
    
  end
  
  def update
    current_user.attributes = params[:user]
    current_user.calculate_metabolic_rates
    
    if current_user.save
      redirect_to edit_metabolic_rates_path
    else
      render :action => :edit
    end
  end
end
