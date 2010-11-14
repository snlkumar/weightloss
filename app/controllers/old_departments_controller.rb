class OldDepartmentsController < ApplicationController
  layout 'old_application'
  
  def index
    @departments = OldDepartment.all
  end
  
  def show
    @department = OldDepartment.find(params[:id])
  end
  
  def new
    @department = OldDepartment.new
  end
  
  def edit
    @department = OldDepartment.find(params[:id])
  end
  
  def create
    @department = OldDepartment.new(params[:old_department])
    
    if @department.save
      redirect_to(old_departments_url, :notice => 'Department was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @department = OldDepartment.find(params[:id])
    
    if @department.update_attributes(params[:old_department])
      redirect_to(old_departments_url, :notice => 'Department was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @department = OldDepartment.find(params[:id])
    @department.destroy
    
    redirect_to(old_departments_url)
  end
end
