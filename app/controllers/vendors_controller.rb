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
   session[:vendor_params] ||= {}
    @vendor = Vendor.new(session[:vendor_params])
    @vendor.current_step = session[:vendor_step]
  end

  #end new
  
 def captchatest
  	elements=Hash.new
  	elements={:recaptcha_response_field => params[:xxx], :recaptcha_challenge_field => params[:vvv]}
   check=verify_recaptcha(request.remote_ip, elements)

	if check[:status] == 'false'
		render :text=> "false"
		return
	else
		render :text=> "true"
		return
	end
 end



    def create
      session[:vendor_params].deep_merge!(params[:vendor]) if params[:vendor]  
      @vendor = Vendor.new(session[:vendor_params])  
      @vendor.current_step = session[:vendor_step]
        if @vendor.valid?  
		if params[:back_button]  
		  @vendor.previous_step  
		elsif @vendor.last_step?
			if @vendor.vendor_type.downcase=="restaurants"
				@rest=Restaurant.new(session[:vendor_params])
				@rest.save
				@vendor=nil
				@vendor=@rest
					@admin =User.where("admin=1")
		      	@admin.each do |admin|
		      	@admin=admin
		  	 		BusinessclaimMailer.newbusiness(@admin, @vendor).deliver
		  	 		end
			else
			      @vendor = Vendor.new(session[:vendor_params])
				   @vendor.save if @vendor.all_valid? 
						@admin =User.where("admin=1")
				   	@admin.each do |admin|
				   	@admin=admin
			  	 		BusinessclaimMailer.newbusiness(@admin, @vendor).deliver 
						end
			end
		else  
		  @vendor.next_step  
		end  
		session[:vendor_step] = "profile" 
        end  
	      if @vendor.new_record?  
		render 'new'  
	      else  
		session[:vendor_step] = session[:vendor_params] = nil  
		flash[:notice] = "vendor saved."  
		redirect_to vendor_path
	  end  
       end  
  #end create

  
  def edit
  	if !session[:vendor].nil? 
	  	if session[:vendor].id==params[:id].to_i
			if !session[:vendor].vendor_type.empty? && session[:vendor].vendor_type!="restaurants"
			 	@vendor=Vendor.find(params[:id])
			 else
			 	@vendor=Restaurant.find(params[:id])
			 end
		else
			@vendor=session[:vendor] #for user couldn't access other profile only saw own
		end
	else
     redirect_to(vendorlogin_vendors_path, :notice => 'Please login to process.')          
	end
  end
  def update
  if !session[:vendor].vendor_type.empty? && session[:vendor].vendor_type!="restaurants"
		 @vendor=Vendor.find(params[:id])
		  respond_to do |format|
		   if @vendor.update_attributes(params[:vendor])
		     format.html { redirect_to(vendorInfo_path(@vendor.id)+"/#{session[:vendor].vendor_type}"+"/#{session[:vendor].vendor_name}") }
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
        format.html { redirect_to(vendorInfo_path(@vendor.id)+"/restaurants"+"/#{session[:vendor].business_name}") }
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
	#redirect_to(vendor_path) 
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
		if @vendor.first.password == params[:password] && !params[:password].empty?
	   	session[:vendor]=@vendor.first
     	   redirect_to (vendorInfo_path(@vendor.first.id)+"/#{session[:vendor].vendor_type}") 	 
      else
     	  redirect_to(vendorlogin_vendors_path, :notice => 'incorrect password.') 
		end
   else
     @vendor=Restaurant.find_by_sql("select * from restaurants where email='"+params[:email]+"'")
     if @vendor!=nil && !@vendor.empty?
		if @vendor.first.password== params[:password] && !params[:password].empty?
	   	session[:vendor]=@vendor.first
     	   redirect_to (vendorInfo_path(@vendor.first.id)+"/restaurants"+"/#{session[:vendor].business_name}")	 
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
