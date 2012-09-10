class VendorsController < ApplicationController
		
  def search
    if !params[:searchtype].nil?
      if params[:filterQuery].nil? 
        params[:filterQuery]=""	
      end

      if params[:searchtype]=="all"

        @data=Vendor.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        @cols="all"

      elsif params[:searchtype]=="restaurants"
        if params[:filterBy]=="zipcode"
          params[:filterBy]="zipcode"
        end
        @data=Restaurant.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)

        @cols="restaurants"
      else
		 @data=Vendor.where("vendor_type ='"+params[:searchtype]+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").page(params[:page] || 1).per(30)
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
      if params[:id] && params[:restaurants]!=nil && params[:restaurants]=="restaurants"
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
  if params[:vendor][:vendor_type]!= "restaurants"
   @vendor=Vendor.new(params[:vendor])
   else
#new code added
  params[:vendor]
   @vendor=Restaurant.create(:business_name=>params[:vendor][:business_name], :city=>params[:vendor][:city],:state=>params[:vendor][:state],:zipcode=>params[:vendor][:zipcode])	
    end
   
   check=verify_recaptcha(request.remote_ip, params)
	if check[:status] == 'false'
	  @notice = "captcha incorrect"
    render :action => "new"
    return
	 else
     if @vendor.save
        redirect_to(vendor_path, :notice => 'Vendor was successfully updated.')
     else
       render :action => "new"
     end
   end
  end
  #end create

  
  def edit
    @vendor=Vendor.find(params[:id])
  end
  
  def businessclaim
	  @claim=Businessclaim.create(params[:businessclaim])
	  if @claim.save
		  if params[:businessclaim][:business_type].downcase=="restaurants"
		  	Restaurant.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")  	 
		  else
		  	Vendor.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")
	  	 
		  end
	  		redirect_to(vendor_path, :notice => 'Successfully claimed.')
		else
		  render :action => "new"
		end
	end  
end
