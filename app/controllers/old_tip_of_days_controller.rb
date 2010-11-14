class OldTipOfDaysController < ApplicationController
  layout 'old_application'
  
  def index
    @tip_of_days = OldTipOfDay.all
  end
  
  def show
    @tip_of_day = OldTipOfDay.find(params[:id])
  end
  
  def new
    @tip_of_day = OldTipOfDay.new
  end
  
  def edit
    @tip_of_day = OldTipOfDay.find(params[:id])
  end
  
  def create
    @tip_of_day = OldTipOfDay.new(params[:old_tip_of_day])
    
    if @tip_of_day.save
      redirect_to(old_tip_of_days_url, :notice => 'Tip of the Day was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @tip_of_day = OldTipOfDay.find(params[:id])
    
    if @tip_of_day.update_attributes(params[:old_tip_of_day])
      redirect_to(old_tip_of_days_url, :notice => 'Tip of the Day was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @tip_of_day = OldTipOfDay.find(params[:id])
    @tip_of_day.destroy

    redirect_to(old_tip_of_days_url)
  end
end
