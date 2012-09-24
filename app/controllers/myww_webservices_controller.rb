class MywwWebservicesController < ApplicationController

  def login
    @user=User.find_by_email(params[:email])
    @status=""
    
    if @user!=nil
      #bcrypt= ::BCrypt::Password.new(@user.encrypted_password)
      #pass=::BCrypt::Engine.hash_secret("#{params[:password]}#{pepper}", bcrypt.salt)
      if @user.valid_password?(params[:password]) #Devise.secure_compare(@user.encrypted_password,pass)
          @status={"status-msg"=>"111"}   #111=>login success
          session[:user]=@user
          ## update login detail of user
          setCurrentLoginInfo
      else
          @status={"status-msg"=>"112"}   #112 =>email or password error
        
      end
      
    else
      @status={"status-msg"=>"113"}       #113 =>email error
    end
    respond_to do |format|
      format.js { render :json =>@status.to_json}
    end
  end
 
  ##########################
  
  def getSession
    if session[:user]
      @status=session[:user]
    else
      @status={"status-msg"=>"114"}   #114=> not login
   end
   respond_to do |format|
     format.js { render :json =>@status.to_json}
   end
  end
  
  ###########################
  
  def forget_pass
  
  
  end
  
  def logout
    if session[:user]
      session[:user].destroy
      @status={"status-msg"=>"116"}   #116=> logout
    else
      @status={"status-msg"=>"114"}   #114=> not login
    end
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
   end
  end
  
  ###############################
  
  def register_user
  
    if params
      @user=User.find_by_email(params[:user][:email]) # check user exist
      
      if @user!=nil
        @status={"status-msg"=>"117"}   #user already exist
      else
        stretches=10  #these value same as set in devise gem (pepper=nil and stretches=10)
        pepper=nil
       
        #create encypted password for user
        encrypt_pass=::BCrypt::Password.create("#{params[:user][:password]}#{pepper}", :cost =>stretches ).to_s

        params[:user][:password]=""
        params[:user][:encrypted_password]=encrypt_pass
        
        @user=User.create(params[:user])
        if @user.save
         @status={"status-msg"=>"100"}   #100=> for successfully registration
         session[:user]=@user
         
         ##insert user weight in weight
          check=insertWeight(params[:user][:weight].to_i,@user.id)
         ## update login detail of user
         if check=="100"
          setCurrentLoginInfo
         else
          @status={"status-msg"=>"118"}
         end
         
        else
          @status={"status-msg"=>"118"}   #100=> for user not saved
        end
      end
    else
      @status={"status-msg"=>"119"}   #119=> params is null
    end

    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end

  ########### Current Login Info #################
  def setCurrentLoginInfo
    @user=User.find(session[:user].id)
    
    if @user.last_sign_in_at.nil?
      @user.last_sign_in_at=DateTime.now
    end
    
    if @user.last_sign_in_ip.nil?
      @user.last_sign_ip=request.remote_ip
    end
    
    if @user.sign_in_count==nil || @user.sign_in_count==0
      @user.sign_in_count=1
    else
      @user.sign_in_count+=1
    end
    
    @user.update_attributes(:current_sign_in_at => DateTime.now, :current_sign_in_ip =>request.remote_ip , :last_sign_in_at => @user.last_sign_in_at , :last_sign_in_ip =>@user.last_sign_in_ip , :sign_in_count => @user.sign_in_count)
    
  end
  #################### end ############################
  
  def insertWeight(weight,user_id)
    if session[:user]
      params=Hash.new
      params[:weight]={:user_id=>user_id,:weight=>weight}
      @weight=Weight.create(params[:weight])
      if @weight.save
        return "100"
      end
    else
      return "118"
    end
  end
  
  ###########################################################
  
 def photo
 params[:photo]
    @photo=Photo.create(params[:photo])
    if @photo.save
      @status={"status-msg"=>"119"}   #100=> for user not saved"120"
    else
       @status={"status-msg"=>"120"}   
    end
         respond_to do |format|
     format.js { render :json =>@status.to_json}
   end
 end


  #this method for testing, to check webservice
  def check

  end  
  
end
