class OldDepartmentsController < ApplicationController
  layout 'old_application'
  
  # GET /departments
  # GET /departments.xml
  def index
    @departments = OldDepartment.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @departments }
    end
  end

  # GET /departments/1
  # GET /departments/1.xml
  def show
    @department = OldDepartment.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @department }
    end
  end

  # GET /departments/new
  # GET /departments/new.xml
  def new
    @department = OldDepartment.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @department }
    end
  end

  # GET /departments/1/edit
  def edit
    @department = OldDepartment.find(params[:id])
  end

  # POST /departments
  # POST /departments.xml
  def create
    @department = OldDepartment.new(params[:old_department])

    respond_to do |format|
      if @department.save
        format.html { redirect_to(@department, :notice => 'Department was successfully created.') }
        format.xml  { render :xml => @department, :status => :created, :location => @department }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @department.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /departments/1
  # PUT /departments/1.xml
  def update
    @department = OldDepartment.find(params[:id])

    respond_to do |format|
      if @department.update_attributes(params[:old_department])
        format.html { redirect_to(@department, :notice => 'Department was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @department.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /departments/1
  # DELETE /departments/1.xml
  def destroy
    @department = OldDepartment.find(params[:id])
    @department.destroy

    respond_to do |format|
      format.html { redirect_to(departments_url) }
      format.xml  { head :ok }
    end
  end
end
