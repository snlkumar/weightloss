class OldItemsController < ApplicationController
  layout 'old_application'
  
  def index
    @items = OldItem.all
  end
  
  def show
    @item = OldItem.find(params[:id])
  end
  
  def new
    @item = OldItem.new
  end
  
  def edit
    @item = OldItem.find(params[:id])
  end
  
  def create
    @item = OldItem.new(params[:old_item])
    
    if @item.save
      redirect_to(old_items_url, :notice => 'Item was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @item = OldItem.find(params[:id])
    
    if @item.update_attributes(params[:old_item])
      redirect_to(old_items_url, :notice => 'Item was successfully updated.')
    else
      render :action => "edit" 
    end
  end
  
  def destroy
    @item = OldItem.find(params[:id])
    @item.destroy
    
    redirect_to(old_items_url)
  end
end
