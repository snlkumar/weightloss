class VendorsController < ApplicationController
  def search
=begin    
    if !params[:searchtype].nil?
      if params[:searchtype]=="all"
        @data=Vendor.all
      elsif params[:searchtype]=="restaurants"
        @data=Vendor.find_by_sql("select * from restaurants where name like '%"+params[:query]+"%'")
      else
        @data=Vendor.where("vendor_type='"+params[:searchtype]+"' and (title like '%"+params[:query]+"%' or vendor_name like '%"+params[:query]+"%')")
      end
      render :text => @data.to_json
    end
    return
=end
  end
end
