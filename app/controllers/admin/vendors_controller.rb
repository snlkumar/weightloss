class Admin::VendorsController < ApplicationController
  layout 'new_admin' 

	def search
       if !params[:searchtype].nil?
				if params[:filterQuery].nil? 
				  params[:filterQuery]=""
						else
						params[:filterQuery]=params[:filterQuery].strip	
				end

		   if params[:searchtype]=="all"

		     @vendor=Vendor.where("business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%'").order('business_name ASC')


		   else
			 @vendor=Vendor.where("vendor_type ='"+params[:searchtype]+"' and (business_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%' or fname like '%"+params[:filterQuery]+"%' or lname like '%"+params[:filterQuery]+"%')")
		   end	
   	 end
	 @vendors = Kaminari.paginate_array(@vendor).page(params[:page]).per(50)
    render :layout => 'old_application'
	end

 
################################################################
  def index 	
 	
	    @vendors = Vendor.page(params[:page] || 1).per(50).order('business_name ASC')

		render :layout => 'old_application'

   end
##########################################   


   def show
		  @vendor=Vendor.find(params[:id])
   end



#####################################################

	def edit
		 @vendor=Vendor.find(params[:id])
		 @vendor_cost=@vendor.average_cost
		if @vendor_cost==nil || @vendor_cost==""
		@vendor_cost=0
	end
	
		render 'edit'
	end

###################################################################################

   
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
###########################################################################           
   
   def destroy
			@vendor=Vendor.find(params[:id])

			respond_to do |format|   
				if @vendor.destroy
			 	  format.html {redirect_to((admin_vendors_path), :notice => 'Successfully deleted.')}
				  else
				  format.html { render :action => "delete_vendor"}
			  end
		 end
  end
   
end
