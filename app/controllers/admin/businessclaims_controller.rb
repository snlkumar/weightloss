class Admin::BusinessclaimsController < Admin::BaseController
  layout 'new_admin'
 def index
 @claims = Businessclaim.page(params[:page] || 1).per(50)
 end
 
  def edit
 @claim = Businessclaim.find(params[:id])
  end
  
 def update
 @claim = Businessclaim.find(params[:id])
      if @claim.update_attributes(params[:businessclaim])
		  if params[:businessclaim][:business_type]=="restaurants"
		  	Restaurant.find(params[:businessclaim][:vr_id]).update_attributes(:status=>params[:businessclaim][:status])
		  else
		  	Vendor.find(params[:businessclaim][:vr_id]).update_attributes(:status=>params[:businessclaim][:status])
		  end
	  		redirect_to(admin_businessclaims_path, :notice => 'Successfully updated.')
		else
		  render :action => "edit"
		end
	end
    
end

    
