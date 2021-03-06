class VendorregistrationsController < Devise::RegistrationsController
 

 def create
  	begin
		  build_resource
		  

		  if resource.save
		  
		    
		    if resource.active_for_authentication?

		      sign_in(resource_name, resource)
		      redirect_to '/second_step'
					#respond_with resource, :location => redirect_location(resource_name, resource)
		    else
		      set_flash_message :notice, :inactive_signed_up, :reason => inactive_reason(resource) if is_navigational_format?
		      expire_session_data_after_sign_in!
		      respond_with resource, :location => after_inactive_sign_up_path_for(resource)
		    end
		  else
		    clean_up_passwords(resource)
		    #resource = build_resource({})
		    respond_with_navigational(resource){ render_with_scope :new }
	#      respond_with_navigational(resource) { render_with_scope :new }
		  end
			rescue Exception => exc
				logger.error("Message for the log file #{exc.message}")
				redirect_to '/vendors/sign_up', :notice => "Vendor already exist."
   end
  end
  
   def update
    if resource.update_with_password(params[resource_name])
      set_flash_message :notice, :updated
      sign_in resource_name, resource, :bypass => true
      redirect_to after_update_path_for(resource)
    else
      clean_up_passwords(resource)
      render_with_scope :edit
    end
  end
    
  protected

  def after_sign_up_path_for(resource)
    step_two_path
  end


end
