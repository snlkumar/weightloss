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
   @vendor=Restaurant.create(:business_name=>params[:vendor][:business_name], :city=>params[:vendor][:city],:state=>params[:vendor][:state],:zipcode=>params[:vendor][:zipcode],:vendor_name=>params[:vendor][:vendor_name],:vendor_type=>params[:vendor][:vendor_type],:country=>params[:vendor][:country],:contact1=>params[:vendor][:contact1],:contact2=>params[:vendor][:contact2],:biography=>params[:vendor][:biography],:website_address=>params[:vendor][:website_address],:email=>params[:vendor][:email],:fname=>params[:vendor][:fname],:lname=>params[:vendor][:lname],:password=>params[:vendor][:password],:school=>params[:vendor][:school],:degrees=>params[:vendor][:degrees],:certifications=>params[:vendor][:certifications],:specialities=>params[:vendor][:specialities],:licence_no=>params[:vendor][:licence_no],:licence_states=>params[:vendor][:license_states],:cost=>params[:vendor][:cost],:average_cost=>params[:vendor][:average_cost], :accept_credit_card=>params[:vendor][:accept_credit_card], :insurance=>params[:vendor][:accept_insurance],:year_school=>params[:vendor][:year_school],:accept_cash=>params[:vendor][:accept_cash], :accept_check=>params[:vendor][:accept_check],:payment_plans=>params[:vendor][:payment_plans], :year_school=>params[:vendor][:year_school],:accept_cash=>params[:vendor][:accept_cash], :accept_check=>params[:vendor][:accept_check],:payment_plans=>params[:vendor][:payment_plans],:work_hour=>params[:vendor][:work_hour],:p_address=>params[:vendor][:p_address], :p_city=>params[:vendor][:p_city],:p_state=>params[:vendor][:p_state], :p_cell=>params[:vendor][:p_cell],:p_contact=>params[:vendor][:p_contact],:b_email=>params[:vendor][:b_email], :p_country=>params[:vendor][:p_country],:address1=>params[:vendor][:address1] )	
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
