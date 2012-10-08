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
   
   def show
   @vendor=Vendor.find(params[:id])
   end
   
   def edit
   @vendor=Vendor.find(params[:id])
   end
   
   def update
		 @vendor=Vendor.find(params[:id])
		  respond_to do |format|
		   if @vendor.update_attributes(params[:vendor])
		     format.html {redirect_to((admin_vendors_path), :notice => 'Successfully updated.')}
		   else
		     format.html { render :action => "edit"}
        end
     end
    end      
           
   
   def destroy
   @vendor=Vendor.find(params[:id])
   @vendor.destroy
   redirect_to(admin_vendors_path)
   end
   
end
