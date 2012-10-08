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
  	if @claim.business_type=="restaurants"
  	@status="true"
  	@data=Restaurant.find(@claim.vr_id)
  	else
    @status="false"
  	@data=Vendor.find(@claim.vr_id) 
  	 end
  end
  
  
 def update
 @claim = Businessclaim.find(params[:id])
      if @claim.update_attributes(params[:businessclaim])
		  if params[:businessclaim][:business_type]=="restaurants"
		  	Restaurant.find(params[:businessclaim][:vr_id]).update_attributes(:status=>params[:businessclaim][:status])
		  	@business=Restaurant.find(params[:businessclaim][:vr_id])
		  	if @claim.status!="Pending approval"
			  	if @claim.status=="rejected"
			  	 BusinessclaimMailer.rejected(@claim, @business).deliver
			  	 else
			  	 BusinessclaimMailer.accepted(@claim, @business).deliver
			  	 end
		  	end		  	 		  	
		  else
		  	Vendor.find(params[:businessclaim][:vr_id]).update_attributes(:status=>params[:businessclaim][:status])
		   @business=Vendor.find(params[:businessclaim][:vr_id])
		  	if @claim.status!="Pending approval"		   
		  	if @claim.status=="rejected"
		  	 BusinessclaimMailer.rejected(@claim, @business).deliver
		  	 else
		  	 BusinessclaimMailer.accepted(@claim, @business).deliver
		  	 end
		  	end
		  end
	  		redirect_to(admin_businessclaims_path, :notice => 'Successfully updated.')
		else
		  render :action => "edit"
		end
	end
	
  def destroy
 @claim = Businessclaim.find(params[:id])
 @claim.destroy
 redirect_to(admin_businessclaims_path, :notice => 'Successfully deleted.')
  end 
    
end

    
