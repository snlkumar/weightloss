class VendorsController < ApplicationController
  def search
    if !params[:searchtype].nil?
      if params[:filterQuery].nil? 
        params[:filterQuery]=""
      end
      
      if params[:searchtype]=="all"
        @data=Vendor.where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="all"
      elsif params[:searchtype]=="restaurants"
        if params[:filterBy]=="zipcode"
          params[:filterBy]="zip"
        end
        @data=Restaurant.where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="restaurants"
      else
        @data=Vendor.where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="other" 
      end
    end
  end
 #search method end
 
 def show
   if params[:id] && params[:restaurants]!=nil
    @status="true"  #for restaurants
    @vendor=Restaurant.find(params[:id])
   else
    @status="false"
    @vendor=Vendor.find(params[:id])
   end
 end
  #end show
  
  def new
  end
  #end new
  
  def create
  end
  #end create
  
  def update
  end
  #end
  
  def edit
  end
end 
