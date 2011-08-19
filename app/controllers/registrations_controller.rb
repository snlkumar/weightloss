class RegistrationsController < Devise::RegistrationsController
  
  def create
    build_resource
    
    if resource.save
      @user.update_attribute(:status, 'step_two')
      
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_in(resource_name, resource)
        respond_with resource, :location => redirect_location(resource_name, resource)
      else
        set_flash_message :notice, :inactive_signed_up, :reason => inactive_reason(resource) if is_navigational_format?
        expire_session_data_after_sign_in!
        respond_with resource, :location => after_inactive_sign_up_path_for(resource)
      end
    else
      clean_up_passwords(resource)
      respond_with_navigational(resource) { render_with_scope :new }
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
