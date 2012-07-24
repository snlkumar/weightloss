class VendorsController < ApplicationController
  def search   
    if !params[:searchtype].nil?
      if params[:searchtype]=="all"
        @data=Vendor.page(params[:page] || 1).per(30)
        @cols=Vendor.column_names
      elsif params[:searchtype]=="restaurants"
        @data=Restaurant.where("name like '%"+params[:query]+"%'").page(params[:page] || 1).per(30)
        @cols=Restaurant.column_names
      else
        @data=Vendor.where("vendor_type='"+params[:searchtype]+"' and (title like '%"+params[:query]+"%' or vendor_name like '%"+params[:query]+"%')").page(params[:page] || 1).per(30)
        @cols=Vendor.column_names
      end
    end
  end
end
