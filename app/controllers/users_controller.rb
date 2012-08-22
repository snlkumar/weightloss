class UsersController < ApplicationController
  before_filter :authenticate_user!, :except => [:show, :create, :next, :bmi_update, :weight_update, :step_two]
  before_filter :set_defaults,       :only => [:step_two, :edit, :personal_info]
  
  layout 'signup', :only => [:create, :step_two, :finalize]
  layout 'user_settings', :only => [:update, :account_info, :personal_info, :nutrition_info, :exercise_info]
  
  def show

    @user = User.find(params[:id]) || current_user
	
    if @user.nil?
      redirect_to(root_path) and return
    end
    
    if current_user == @user
      render :layout => "profile"
    elsif @user.private?
      render :action => :private, :layout => "private_profile"
    elsif @user.public?
      render :action => :public_profile, :layout => "public_profile"
    else
      render :action => :private, :layout => "private_profile"
    end
    
    rescue ActiveRecord::RecordNotFound
      redirect_to(root_path)
  end
  
  def step_two
    @slider_height = 60
    @slider_weight = 150
    render :layout => 'signup'
  end
  
  def finalize
    if current_user.update_attributes(params[:user])
      current_user.update_attribute(:status, 'finalize')
      current_user.save # TODO: needed?
      redirect_to edit_metabolic_rates_path
    else
      @slider_height = current_user.height || 60
      @slider_weight = current_user.weight || 150
      render :action => :step_two, :layout => 'signup'
    end
  end
  
  def next
    
  end
  
  def update
    @user = current_user # makes our views "cleaner" and more consistent
    
    if @user.update_attributes(params[:user])
      flash[:notice] = 'Update successful'
      
      case request.referrer
      when /info/
        redirect_to user_edit_personal_info_path(current_user)
      when /nutrition/
        redirect_to user_edit_nutrition_info_path(current_user)
      when /exercise/
        redirect_to user_edit_exercise_info_path(current_user)
      when /account/
        redirect_to user_edit_account_info_path(current_user)
      else
        redirect_to user_edit_account_info_path(current_user)
      end
    else
      case request.referrer
      when /info/
        render :action => :personal_info
      when /nutrition/
        render :action => :nutrition_info
      when /exercise/
        render :action => :exercise_info
      when /account/
        render :action => :account_info
      else
        render :action => :account_info
      end
    end
    
  end
  
  def account_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def personal_info  
    @user = current_user
 	 @photo= Photo.new
    render :layout => 'user_settings'
  end
  
  def nutrition_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def exercise_info
    @user = current_user
    render :layout => 'user_settings'
  end
  
  def bmi
    @user = current_user
    render :layout => "profile"
  end
  
  def weight_update
    current_user.update_attributes(params[:user])
    
    render :text => current_user.weight
  end
  
  def bmi_update
    @user = User.find(params[:id])
    @user.update_attributes(params[:user])
    head(200)
  end
  
  def achievement_date
    render :partial => 'shared/achievement_date', :locals => {:user => current_user}
  end
end
