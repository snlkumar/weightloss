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
    @vendor=Vendor.new
 end
  #end new
  
  def create
   @vendor=Vendor.new(params[:vendor])
   
   check=verify_recaptcha(request.remote_ip, params)

   if check[:status] == 'false'
	  @notice = "captcha incorrect"
    render :action => "new"
    return
	 else
     if @vendor.save
        redirect_to( vendor_path, :notice => 'vendor was successfully created.')
     else
       render :action => "new"
     end
   end
  end
  #end create
  
  def update
  @vendor= Vendor.find(params[:id])

    respond_to do |format|
      if @vedor.update_attributes(params[:vendor])
        format.html { redirect_to(vendors_path, :notice => 'Vendor was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def edit
    @vendor=Vendor.find(params[:id])
  end
end 
