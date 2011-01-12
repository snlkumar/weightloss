class UsersController < ApplicationController
  before_filter :require_no_user, :only => [:new, :create]
  before_filter :require_user,    :only => [:show, :edit, :update, :finalize, :next, :step_two]
  
  def show
    @user = User.find(params[:id])
    render :layout => "profile"
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(params[:user])
    if @user.save
      @user.update_attribute(:status, 'step_two')
      redirect_to :action => :step_two
    else
      p @user.errors.full_messages
      render :action => :new
    end
  end
  
  def step_two
    
  end
  
  def finalize
    if current_user.update_attributes(params[:user])
      current_user.update_attribute(:status, 'finalize')
      redirect_to user_path(current_user)
    else
      p current_user.errors.full_messages
      render :action => :step_two
    end
  end
  
  def next
    
  end
  
  def edit
    @user = @current_user
  end
  
  def update
    @user = @current_user # makes our views "cleaner" and more consistent
    if @user.update_attributes(params[:user])
      redirect_to user_path(@user)
    else
      render :action => :edit
    end
  end
  
  def personal_info
    
  end
  
  def nutrition_info
    
  end
  
  def exercise_info
    
  end
end
