class VendorsController < ApplicationController
  def search   
    if !params[:searchtype].nil? && params[:status].nil?
    	
      if params[:query].nil? 
        params[:query]=""
      end
      
      cookies[:searchtype]=params[:searchtype]
      cookies[:query]=params[:query]
      
      if params[:searchtype]=="all"
        @data=Vendor.page(params[:page] || 1).per(30)
        @cols="all"
      elsif params[:searchtype]=="restaurants"
        @data=Restaurant.where("name like '%"+params[:query]+"%'").page(params[:page] || 1).per(30)
        @cols="restaurants"
      else
        @data=Vendor.where("vendor_type='"+params[:searchtype]+"' or (title like '%"+params[:query]+"%' or vendor_name like '%"+params[:query]+"%')").page(params[:page] || 1).per(30)
        @cols="other" 
      end
    end
 end
 
 #search method end
 
 def search_filter
  if !cookies[:searchtype].nil? && !params[:status].nil? && params[:status]=="true"
    if cookies[:searchtype]=="all"
      @data=(Vendor.page(params[:page] || 1).per(30)).where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'")
      @cols="all"
    elsif cookies[:searchtype]=="restaurants"
      if params[:filterBy]=="zipcode"
        params[:filterBy]="zip"
      end
      @data=(Restaurant.where("name like '%"+cookies[:query]+"%'").page(params[:page] || 1).per(30)).where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'")
      @cols="restaurants"
    else
      @data=(Vendor.where("vendor_type='"+cookies[:searchtype]+"' and (title like '%"+cookies[:query]+"%' or vendor_name like '%"+cookies[:query]+"%')").page(params[:page] || 1).per(30)).where(params[:filterBy]+" like '%"+params[:filterQuery]+"%'")
      @cols="other" 
    end

  end
  render 'search'
 end
 #method end filter_search
 
 def show
   if params[:id] && params[:restaurants]!=nil
    @status="true"  #for restaurants
    @vendor=Restaurant.find(params[:id])
   else
    @status="false"
    @vendor=Vendor.find(params[:id])
   end
 end

end 
