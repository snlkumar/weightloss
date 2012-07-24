class VendorsController < ApplicationController
  def search   
    if !params[:searchtype].nil?
      if params[:query].nil?
        params[:query]=""
      end
      if params[:searchtype]=="all"
        @data=Vendor.page(params[:page] || 1).per(30)
        @cols="all"
      elsif params[:searchtype]=="restaurants"
        @data=Restaurant.where("name like '%"+params[:query]+"%'").page(params[:page] || 1).per(30)
        @cols="restaurants"
      else
        @data=Vendor.where("vendor_type='"+params[:searchtype]+"' and (title like '%"+params[:query]+"%' or vendor_name like '%"+params[:query]+"%')").page(params[:page] || 1).per(30)
        @cols="other" 
      end
    end
  end
end
