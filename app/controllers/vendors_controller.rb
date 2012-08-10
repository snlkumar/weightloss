class VendorsController < ApplicationController
  def search
    if !params[:searchtype].nil?
      if params[:filterQuery].nil? 
        params[:filterQuery]=""
      end
      
      if params[:searchtype]=="all"
        @data=Vendor.where("vendor_name like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="all"
      elsif params[:searchtype]=="restaurants"
        if params[:filterBy]=="zipcode"
          params[:filterBy]="zip"
        end
        @data=Restaurant.where("name like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="restaurants"
      else
        @data=Vendor.where("vendor_name like '%"+params[:filterQuery]+"%' and vendor_type='"+params[:searchtype]+"'").page(params[:page] || 1).per(30)
        @cols="other" 
      end
    end
  end
 #search method end
 
 ##search for text field decipher
  def search_decipher
   
   if params[:searchtype]=="restaurants"
    @vendor = Restaurant.where("name like '%"+params[:filterQuery]+"%'")
   elsif params[:searchtype]!="all"
    @vendor = Vendor.where("vendor_name like '%"+params[:filterQuery]+"%' and vendor_type='"+params[:searchtype]+"'")
   else
    @vendor = Vendor.where("vendor_name like '%"+params[:filterQuery]+"%'")
   end
   
    if @vendor.empty?
      render :json => [{:value => 'No Results', :id => nil}].to_json
    else
			render :json => @vendor.map{|f| {:value => (params[:searchtype]=="restaurants" ? "#{f.name.capitalize} - Restaurant @$ #{f.address} @$ #{f.city} @$ #{f.state} @$ #{f.zip}" : "#{f.vendor_name.capitalize} - #{(f.vendor_type).split('_').join(' ')} @$ #{f.address1} @$ #{f.city} @$ #{f.state} @$ #{f.zipcode}"), :id => f.id} }.to_json
    end
  end
 ##end
 
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
