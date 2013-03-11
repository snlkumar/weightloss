class Admin::BusinessclaimsController < Admin::BaseController
  layout 'new_admin'


 def index
 	@claims = Businessclaim.page(params[:page] || 1).per(50)
 end


 
  def edit
 	@claim = Businessclaim.find(params[:id])
  end
  
  
  def show
  	@claim=Businessclaim.find(params[:id])

		begin
	  		@data=Vendor.find(@claim.vendor_id) 
			rescue
	  		redirect_to admin_businessclaims_path
	      flash[:error] = "Vendor does not exist"
		  end
  	 end

  
  
 def update
 @claim = Businessclaim.find(params[:id])
  begin
       @claim.update_attributes(params[:businessclaim])	  
		  	Vendor.find(params[:businessclaim][:vendor_id]).update_attributes(:status=>params[:businessclaim][:status])
		   @business=Vendor.find(params[:businessclaim][:vendor_id])
			  	if @claim.status!="Pending approval"		   
				  	if @claim.status=="rejected"
				  	 BusinessclaimMailer.rejected(@claim, @business).deliver
				  	 else
				  	 BusinessclaimMailer.accepted(@claim, @business).deliver
				  	 end
			  	end
	  		redirect_to(admin_businessclaims_path, :notice => 'Successfully updated.')
			rescue
	  		redirect_to(admin_businessclaims_path, :notice => 'Vendor does not exist')
		end
	end

	
  def destroy
	 @claim = Businessclaim.find(params[:id])
	 @claim.destroy
	 redirect_to(admin_businessclaims_path, :notice => 'Successfully deleted.')
  end 
    
end

    
