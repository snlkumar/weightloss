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
   @vendor=Restaurant.new(params[:vendor] )	
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
  if session[:vendor].vendor_type!=nil && session[:vendor].vendor_type!="restaurants"
    @vendor=Vendor.find(params[:id])
    else
    @vendor=Restaurant.find(params[:id])
    end
  end
  
  def update
  if session[:vendor].vendor_type!=nil && session[:vendor].vendor_type!="restaurants"
		 @vendor=Vendor.find(params[:id])
		  respond_to do |format|
		   if @vendor.update_attributes(params[:vendor])
		     format.html { redirect_to(vendorInfo_path(@vendor.id), :notice => 'Successfully updated.') }
		     format.xml  { head :ok }
		   else
		     format.html { render :action => "edit" }
		     format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
		    end
		   end
      
    else
        @vendor=Restaurant.find(params[:id])
		  respond_to do |format|        
         if @vendor.update_attributes(params[:restaurant])
        format.html { redirect_to(vendorInfo_path(@vendor.id)+"/restaurants") }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
      end
      end
    end
  end

  
  def businessclaim
  params[:businessclaim]
	@cfname= params[:businessclaim][:claimfname]
	@clname= params[:businessclaim][:claimlname]
	@cemail= params[:businessclaim][:claimemail]
	@contact= params[:businessclaim][:claimcontact]
	@vr_id= params[:businessclaim][:vr_id]
	@btype= params[:businessclaim][:business_type]
	@stat= params[:businessclaim][:status]
	
  check=verify_recaptcha(request.remote_ip, params)
	if check[:status] == 'false'
	@captchastatus="false"
	render 'search'
	#redirect_to(vendor_path, :captchastatus =>"false") 
	  else	 	  
	  @claim=Businessclaim.new(params[:businessclaim])
	   
	  if @claim.save
	  	  
		  if params[:businessclaim][:business_type].downcase=="restaurants"
		  	Restaurant.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")
		  	@business=Restaurant.find(params[:businessclaim][:vr_id])
		  	@admin =User.where("admin=1")
         @admin.each do |admin|
         @admin=admin
		  	 BusinessclaimMailer.businessclaim(@admin, @claim, @business).deliver
		  	 end
		  else
		  	Vendor.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")
		  	@business=Vendor.find(params[:businessclaim][:vr_id])
		  	@admin =User.where("admin=1")
         @admin.each do |admin|
         @admin=admin
		  	 BusinessclaimMailer.businessclaim(@admin, @claim, @business).deliver
		  	 end
		  end
	  		redirect_to(vendor_path, :notice => 'Successfully claimed.')
		else
		  render :action => "new"
		end
	end 
	end

	
	def vendorlogin1
	@vendor=Vendor.find_by_sql("select * from vendors where email='"+params[:email]+"'")
	
	if @vendor!=nil && !@vendor.empty?
		if @vendor.password== params[:password]
	   	session[:vendor]=@vendor
     	   redirect_to (vendorInfo_path(@vendor.id)) 	 
      else
     	  redirect_to(vendorlogin_vendors_path, :notice => 'incorrect password.') 
		end
   else
     @vendor=Restaurant.find_by_sql("select * from restaurants where email='"+params[:email]+"'")
     if @vendor!=nil && !@vendor.empty?
		if @vendor.password== params[:password]
	   	session[:vendor]=@vendor
     	   redirect_to (vendorInfo_path(@vendor.id)+"/restaurants")	 
      else
     	  redirect_to(vendorlogin_vendors_path, :notice => 'incorrect password.') 
		end
     else
       redirect_to(vendorlogin_vendors_path, :notice => 'User not found.')          
	 end
	end
  end
	
	def logout_vendor
		session[:vendor]=nil
		redirect_to vendorlogin_vendors_path
	end
	
	
		 
end
