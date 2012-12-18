class Admin::VendorsController < ApplicationController
  layout 'new_admin' 

	def search
	     if !params[:searchtype].nil?
      if params[:filterQuery].nil? 
        params[:filterQuery]=""	
      end

      if params[:searchtype]=="all"

        @vendor1=Vendor.where("business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%'").order('business_name ASC')
@vendor2=Restaurant.where("business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%'")
@vendor=(@vendor2|@vendor1)
@vendors = Kaminari.paginate_array(@vendor).page(params[:page]).per(50)

      elsif params[:searchtype]=="restaurants"
        @vendors=Restaurant.where("business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(50)

      else
		 @vendors=Vendor.where("vendor_type ='"+params[:searchtype]+"' and (business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%')").page(params[:page] || 1).per(50)
      end	
    end

    render :layout => 'old_application'
	end

 
################################################################
  def index 	
 	if params[:status]
  	 @status=params[:status]
  	 else
  	 @status="true"  	   
       end

  	 if @status=="false"
	    @vendors = Vendor.page(params[:page] || 1).per(50).order('business_name ASC')
	  else    
	    @vendors = Restaurant.page(params[:page] || 1).per(50).order('business_name ASC')
	  end    
		render :layout => 'old_application'

   end
##########################################   
   def show
	if params[:id] && params[:restaurants]=="restaurants"
		   @status="true"  #for restaurants
			 @vendor=Restaurant.find(params[:id])
		  else
			@status="false"
		  @vendor=Vendor.find(params[:id])
	  end
   end


#####################################################3



#####################################################

	def edit_vendor

	      if params[:id] && params[:restaurants]!=nil && params[:restaurants]=="restaurants"#for restaurants
		    @vendor=Restaurant.find(params[:id])
				 @vendor_cost=@vendor.average_cost
				if @vendor_cost==nil || @vendor_cost==""
				@vendor_cost=0
			end
                    session[:type]="restaurants"

	       else
		    session[:type]=nil
	    	    @vendor=Vendor.find(params[:id])
				 @vendor_cost=@vendor.average_cost
				if @vendor_cost==nil || @vendor_cost==""
				@vendor_cost=0
			end
		end
	
		render 'edit'
	end

###################################################################################

   
   def update_vendor

      if session[:type] && session[:type]=="restaurants"#for restaurants
	    @vendor=Restaurant.find(params[:id])
	    session[:type]=nil
	       respond_to do |format|
		   if @vendor.update_attributes(params[:restaurant])
		     format.html {redirect_to((admin_vendors_path), :notice => 'Successfully updated.')}
		   else
		     format.html { render :action => "edit"}
		   end
		end
       else
    	    @vendor=Vendor.find(params[:id])
                  respond_to do |format|
		   if @vendor.update_attributes(params[:vendor])
		     format.html {redirect_to((admin_vendors_path), :notice => 'Successfully updated.')}
		   else
		     format.html { render :action => "edit"}
      		    end		  
        end
     end
end   
###########################################################################           
   
   def delete_vendor
	 if params[:id] && params[:restaurants]!=nil && params[:restaurants]=="restaurants"#for restaurants
			@vendor=Restaurant.find(params[:id])
		else
			@vendor=Vendor.find(params[:id])
	end

	respond_to do |format|   
		if @vendor.destroy
	 	  format.html {redirect_to((admin_vendors_path), :notice => 'Successfully deleted.')}
	     else
	     format.html { render :action => "delete_vendor"}
	  end
	 end
  end
   
end
