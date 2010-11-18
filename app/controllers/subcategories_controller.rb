class SubcategoriesController < ApplicationController
  layout 'old_application'
  
  def index
    
  end
  
  def new
    @subcategory = Subcategory.new
  end
  
  def edit
    @subcategory = Subcategory.find(params[:id])
  end
  
  def create
    @subcategory = Subcategory.new(params[:subcategory])
    
    if @subcategory.save
      redirect_to subcategories_path
    else
      render :action => :new
    end
  end
  
  def update
    @subcategory = Subcategory.find(params[:id])
    
    if @subcategory.update_attributes(params[:subcategory])
      redirect_to subcategories_path
    else
      render :action => :edit
    end
  end
  
  def destroy
    @subcategory = Subcategory.find(params[:id])
    
    @subcategory.destroy
    redirect_to subcategories_path
  end

end
