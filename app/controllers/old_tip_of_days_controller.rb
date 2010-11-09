class OldTipOfDaysController < ApplicationController
  layout 'old_application'
  
  # GET /tip_of_days
  # GET /tip_of_days.xml
  def index
    @tip_of_days = OldTipOfDay.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @tip_of_days }
    end
  end

  # GET /tip_of_days/1
  # GET /tip_of_days/1.xml
  def show
    @tip_of_day = OldTipOfDay.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @tip_of_day }
    end
  end

  # GET /tip_of_days/new
  # GET /tip_of_days/new.xml
  def new
    @tip_of_day = OldTipOfDay.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @tip_of_day }
    end
  end

  # GET /tip_of_days/1/edit
  def edit
    @tip_of_day = OldTipOfDay.find(params[:id])
  end

  # POST /tip_of_days
  # POST /tip_of_days.xml
  def create
    @tip_of_day = OldTipOfDay.new(params[:old_tip_of_day])

    respond_to do |format|
      if @tip_of_day.save
        format.html { redirect_to(@tip_of_day, :notice => 'TipOfDay was successfully created.') }
        format.xml  { render :xml => @tip_of_day, :status => :created, :location => @tip_of_day }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @tip_of_day.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /tip_of_days/1
  # PUT /tip_of_days/1.xml
  def update
    @tip_of_day = OldTipOfDay.find(params[:id])

    respond_to do |format|
      if @tip_of_day.update_attributes(params[:old_tip_of_day])
        format.html { redirect_to(@tip_of_day, :notice => 'TipOfDay was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @tip_of_day.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /tip_of_days/1
  # DELETE /tip_of_days/1.xml
  def destroy
    @tip_of_day = OldTipOfDay.find(params[:id])
    @tip_of_day.destroy

    respond_to do |format|
      format.html { redirect_to(tip_of_days_url) }
      format.xml  { head :ok }
    end
  end
end
