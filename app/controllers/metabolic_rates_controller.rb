class MetabolicRatesController < ApplicationController
  layout 'tracking'
  
  before_filter :authenticate_user!
  
  def edit
    @user = current_user
  end
  
  def update
    if current_user.birthdate.blank?
      redirect_to(user_edit_personal_info_path(current_user), :alert => 'Please set your birthdate first, we need it to perform your BMR/RMR calculations of your goal.') and return
    elsif params[:user][:activity_level].blank?
      redirect_to(edit_metabolic_rates_path, :alert => 'Please select your level of activity.') and return
    end
    
    if params[:user][:desired_weight].to_i >= current_user.weight
      flash.now[:warning] = 'We currently only calculate for weight lose, please choose a desired weight lower than your current weight'
      render(:action => :edit) and return
    end
    
    current_user.attributes = params[:user]
    current_user.calculate_metabolic_rates
    
    if current_user.save
      redirect_to user_path(current_user), :notice => 'Your goal has been saved.'
    else
      render :action => :edit
    end
  end
end
