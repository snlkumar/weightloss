class Admin::VendorsController < ApplicationController
  layout 'new_admin' 



   def index 	
 	if params[:status]
  	 @status=params[:status]
  	 else
  	 @status="true"  	   
       end

  	 if @status=="false"
	    @vendors = Vendor.page(params[:page] || 1).per(50)
	  else    
	    @vendors = Restaurant.page(params[:page] || 1).per(50)
	end    
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

#####################################################

	def edit_vendor

	      if params[:id] && params[:restaurants]!=nil && params[:restaurants]=="restaurants"#for restaurants
		    @vendor=Restaurant.find(params[:id])
                    session[:type]="restaurants"

	       else
		    session[:type]=nil
	    	    @vendor=Vendor.find(params[:id])
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
