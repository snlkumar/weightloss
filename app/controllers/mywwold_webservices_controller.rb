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
    #@weight=Weight.where(:user_id=>session[:user].id).first.weight
    #session[:user].weight=@weight
      @user=User.find(session[:user].id)
        session[:user]=@user
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
  @user=User.find_by_email(params[:email])
    @status="" 
    if @user!=nil
    	@user.send_reset_password_instructions()
      @status={"status-msg"=>"600"}       #113 =>email sent
    else
      @status={"status-msg"=>"601"}    #113 =>invalid email
    end
     respond_to do |format|
     format.js { render :json =>@status.to_json}
   end
  end
 
#################################
  
  def logout
    if session[:user]
      session[:user]=nil
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
  
    ###########################################################
  
  def getDiaryWorkout
    if params[:userid]
      if params[:date_on] && params[:date_on].downcase!="today"
        @start_date = Time.zone.parse(params[:date_on]).strftime("%Y-%m-%d")
      else
        @start_date = Time.zone.now.strftime("%Y-%m-%d")
      end

    @workouts=Workout.find_by_sql("SELECT wi.exercise_id,w.id,e.description,wi.calories,w.time_from,w.note,w.trained_on FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+params[:userid]+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id")

    if @workouts.empty?
       @status=nil  #empty data
     else
      @status=@workouts
     end
     
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
    
    else
      @status={"status-msg"=>"114"}   #114=> not id not available
    end
  end
  
  ######################################################
  
  def getDiaryMeal
     
    if params[:userid]
      if params[:date_on] && params[:date_on].downcase!="today"
        @start_date = Time.zone.parse(params[:date_on]).strftime("%Y-%m-%d")
      else
        @start_date = Time.zone.now.strftime("%Y-%m-%d")
      end
     
     @meals = Meal.find_by_sql("SELECT mi.food_id,m.id,f.name,m.note from meals m,meal_items mi,foods f where f.id=mi.food_id and m.id = mi.meal_id and m.user_id="+params[:userid]+" and m.ate_on='"+ @start_date.to_s+"'")
     
     if @meals.empty?
        @status=nil  #empty data
     else
        @status=@meals
     end

    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
    
    else
      @status={"status-msg"=>"114"}   #114=> not id not available
    end
  end
  
  ################################################################
  
 def getDiaryMealDetail
    if params[:foodid] && params[:meal_item_id]
      @meals_detail=Meal.find_by_sql("SELECT f.name,m.meal_type,ifnull(mi.calories,0) as calories,ifnull(f.total_fat,0) as fat,ifnull(f.carbohydrt,0) as carbohydrt,ifnull(f.protein,0) as protein from meals m, meal_items mi,foods f where f.id="+params[:foodid]+" and m.id=mi.meal_id and m.id ="+params[:meal_item_id])
      
       if @meals_detail.empty?
         @status={"status-msg"=>"130"}  #empty data
       else
        @status=@meals_detail.first
       end
    else
      @status={"status-msg"=>"id not found"}  #empty data
    end
   
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end

###################################################################
  def getDiaryWorkoutDetail
    if params[:exercise_id] && params[:workout_id]
      @workout_detail=Workout.find_by_sql("SELECT e.description,wi.calories,w.time_from,w.note,w.trained_on FROM exercises e ,workout_items wi, workouts w where e.id="+params[:exercise_id]+" and w.id=wi.workout_id and w.id ="+params[:workout_id])
      
       if @workout_detail.empty?
         @status={"status-msg"=>"130"}  #empty data
       else
        @status=@workout_detail.first
       end
    else
      @status={"status-msg"=>"id not found"}  #empty data
    end
   
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end
  
  ########################## get food list ############################
  def foodsList
    if session[:user] 
      if params[:foodname]
        terms  = params[:foodname].split(/,|\s/).reject(&:blank?)
        conds  = terms.collect{|t| "name LIKE ?"}.join(' AND ')
        @foods = Food.with_a_serving_size.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
        if @foods.empty?
          @status = {:value => 'No Results', :id => nil}
        else
        
        @status= @foods.map{|f| {:value => ("#{f.name} *** #{f.gmwt_desc1} *** #{f.energ_kcal} "), :id => f.id} }
        end
      else
        @status={"status-msg"=>"food name field cannot be empty"}
      end
    else
      @status={"status-msg"=>"user not exist"}
    end
    
    render :json => @status
    return
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
   	end
   	
  end
  #####################################################################
  
  ########################## get exercise list ########################
  def exercisesList
    if session[:user]
      if params[:exercisename]
        terms  = params[:exercisename].split(/,|\s/).reject(&:blank?)

        @exercises = Exercise.where("description like '%#{terms[0]}%'")
    
        if @exercises.empty?
          @status = {:value => 'No Results', :id => nil}
        else
        @weight=session[:user].weight
        @status= @exercises.map{|f| {:value => "#{f.description} *** #{f.mets ? (60*f.mets*3.5*@weight/200) : (0)} Cal/Hr", :id => f.id} }.to_json
        end
      else
        @status={"status-msg"=>"exercise name field cannot be empty"}
      end
    else
      @status={"status-msg"=>"user not exist"}
    end
    
    render :json => @status
    return
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
   	end
   	
  end
  #####################################################################
  
  ################################################################
  
 
 def photo
  
	if params[:id]
		 @user=User.find(params[:id])
		 @userfile= params[:userfile]
		 @userfile.rewind
		 @filename = "#{Rails.root}/public/"+params[:id].to_s+@userfile.original_filename
	  
	 File.open(@filename, "wb") do |file|
		file.write(@userfile.read)
	 end         
    
    @user.avatar=File.open(@filename)     
     if @user.save
        @status={"status-msg"=>"141"}
        File.delete(@filename)
		    @user=User.find(params[:id])
          session[:user]=@user
		  else
		     @status={"status-msg"=>"142"}
		  end  
	  else
		 @status={"status-msg"=>"user not exist"}
	  end

  respond_to do |format|
       format.js { render :json =>@status.to_json}
    end   
end 
 
=begin 
 def photo
 	@user=User.find(:id) 	
 	@userfile= params[:userfile]
 	@userfile.rewind
 	@filename = "#{Rails.root}/public/#{@user.id}"+"@userfile.original_filename"
	File.open(@filename, "wb") do |file|
	file.write(@userfile.read)
	end      
   
   @user.avatar=File.open(@filename)
     
   if @user.save
     	@status={"status-msg"=>"141"}
     	File.delete(@filename)
   else
      @status={"status-msg"=>"142"}
   end  
 		
 	respond_to do |format|
     format.js { render :json =>@status.to_json}
 	end  
end
=end

####################################################################################################
 
 def avatar_path
  if session[:user]
	 if User.find(session[:user].id).avatar_file_name!="NULL"
		@url=User.find(session[:user].id).avatar.url(:profile)
		  @path={"imagepath"=> request.protocol+request.host_with_port+@url}
	      else
	 	 @path={"imagepath"=> "null"}
	 end
   respond_to do |format|
     format.js { render :json =>@path.to_json}
   end
  end
   
  # @url=User.find(129).avatar.url(:profile)
  # @path={"imagepath"=> request.protocol+request.host_with_port+@url}
  # render :json=>@path
  # return
end

########################################################################################
  
  def goals
    @user=User.find(params[:id])    
    @user.update_attributes(:activity_level=>params[:activity_level], :desired_weight=>params[:desired_weight],:height=>params[:height],:weight=>params[:weight])
    
    @user.calculate_metabolic_rates
    
    if @user.save
			@user=User.find(params[:id])
          session[:user]=@user
      @status={"status-msg"=>"160"}
    else
      @status={"status-msg"=>"161"}  
    end 
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end
 ##################################################################################     
   
     def updateprofile
	@user=User.find(params[:id])
        @user.update_attributes(:first_name=>params[:first_name], :last_name=>params[:last_name],:birthdate=>params[:birthdate],:gender=>params[:gender],:weight=>params[:weight],:height=>params[:height],:city=>params[:city],:state=>params[:state],:username=>params[:username],:email=>params[:email])
   	
       if @user.save
	   @user=User.find(params[:id])
            session[:user]=@user
             @status={"status-msg"=>"160"}
         else
          @status={"status-msg"=>"161"}  
       end 
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end

###########################################################################

   def vendor

     if !params[:searchtype].nil?
      if params[:filterQuery].nil? 
	params[:filterQuery]=""	
      end
      if params[:searchtype].capitalize=="All"

@data=Vendor.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(5)
@data1=Vendor.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").length
	      if !@data.empty?
	      	@status= @data.map{|f| {:id => f.id, :state=>f.state, :name=>f.vendor_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}
		else
		@status=nil 
	      end


      elsif params[:searchtype].downcase=="restaurants"

	@data=Restaurant.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(5)
	@data1=Restaurant.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").length

	      if !@data.empty?
	      	@status= @data.map{|f| {:id => f.id, :state=>f.state, :name=>f.business_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}
		else
		@status=nil 
	      end


      else
           @data=Vendor.where("vendor_type ='"+params[:searchtype].downcase+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").page(params[:page] || 1).per(5)
	   @data1=Vendor.where("vendor_type ='"+params[:searchtype].downcase+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").length

	     if !@data.empty?
	      	@status= @data.map{|f| {:id => f.id, :state=>f.state, :name=>f.vendor_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}
		else
		@status=nil
	      end
	   end
         respond_to do |format|
           format.js { render :json =>@status.to_json}
         end
      end   
   end
##############################
   def vendordetail
    if params[:id] && params[:vendor_type]=="restaurants"
	  @vendor=Restaurant.find(params[:id])
	  	
      else
	  @vendor=Vendor.find(params[:id])
   end
	@status=@vendor       
        respond_to do |format|
        format.js { render :json =>@status.to_json}
      end
   end


  #this method for testing, to check webservice
  def check

  end  
  
end
