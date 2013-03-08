class MywwWebservicesController < ApplicationController

  def login

    @user=User.find_by_email(params[:email])

    @status=""
    
    if @user!=nil
      #bcrypt= ::BCrypt::Password.new(@user.encrypted_password)
      #pass=::BCrypt::Engine.hash_secret("#{params[:password]}#{pepper}", bcrypt.salt)
      if @user.valid_password?(params[:password]) #Devise.secure_compare(@user.encrypted_password,pass)
          @status={"status-msg"=>"111", "id"=>"#{@user.id}", "Gender"=>"#{@user.gender}"}   #111=>login success
          session[:user_id] = @user.id

          ## update login detail of user
          setCurrentLoginInfo
      else
          @status={"status-msg"=>"112"}   #112 =>email or password error
        
      end
      
    else
      @status={"status-msg"=>"113"}       #113 =>email error
    end
   
   render :json =>@status.to_json
    #respond_to do |format|
     # format.js { render :json =>@status.to_json}
   # end
  end
  
  def forget_pass
  @user=User.find_by_email(params[:email])
    @status="" 
    if @user!=nil
    @user.send_reset_password_instructions()
      @status={"status-msg"=>"600"}       #113 =>email sent
    else
      @status={"status-msg"=>"601"}    #113 =>invalid email
    end
    
    render :json =>@status.to_json
#     respond_to do |format|
#     format.js { render :json =>@status.to_json}
#   end
  end
 
###############################################################################
  
  def logout
    if session[:user_id]
      session[:user_id]=nil
      @status={"status-msg"=>"116"}   #116=> logout
    else
      @status={"status-msg"=>"114"}   #114=> not logout
    end
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
   end
  end
  
  #############################################################################
  
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

        #params[:user][:password]=""
        params[:user][:encrypted_password]=encrypt_pass
        
        @user=User.create(params[:user])
        if @user.save
         @status={"status-msg"=>"100"}   #100=> for successfully registration
         session[:user_id] = @user.id
         
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

   render :json =>@status
#    respond_to do |format|
#     format.js { render :json =>@status.to_json}
 #   end
      end

  ######################### Current Login Info ################################
  def setCurrentLoginInfo
    @user=User.find(session[:user_id])
    
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
  ################################# end #######################################
  
  def insertWeight(weight,user_id)
    if session[:user_id]
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
  
  #############################################################################
  
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
  
  #############################################################################
  
  ######################### getDiaryWorkoutDetail #############################
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
  #############################################################################
  def getDiaryMeal
     
    if params[:userid]
		   if params[:date_on]
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

#    respond_to do |format|
#     format.js { render :json =>@status.to_json}
 #   end
    
    else
      @status={"status-msg"=>"114"}   #114=> not id not available
    end
    
    render :json=>@status.to_json
  end
  
  #############################################################################
  
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
  
  ############################ get food list ##################################
  def foodsList

      if params[:foodname]
        terms  = params[:foodname].split(/,|\s/).reject(&:blank?)
        conds  = terms.collect{|t| "name LIKE ?"}.join(' AND ')
        @foods = Food.with_a_serving_size.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
        if @foods.empty?
          @status =nil
        else
        
        @status= @foods.map{|f| {:name=>f.name, :unit=>f.gmwt_desc1, :cal=>f.energ_kcal, :id => f.id} }
        end
      else
        @status={"status-msg"=>"food name field cannot be empty"}
      end
    
    render :json =>@status.to_json
    #respond_to do |format|
     #format.js { render :json =>@status.to_json}
   	#end
   	
  end
  #############################################################################
  
  ############################ get exercise list ##############################
  def exercisesList
    if session[:user_id]
      if params[:exercisename]
        terms  = params[:exercisename].split(/,|\s/).reject(&:blank?)

        @exercises = Exercise.where("description like '%#{terms}%'")
  
        if @exercises.empty?
          @status = nil
        else
          @weight=(Weight.where(:user_id => session[:user_id]).select("weight").first).weight.to_f
          @status= @exercises.map{|f| {:value => "#{f.description} #{f.mets ? (60*f.mets*3.5*@weight/200) : (0)} Cal/Hr", :id => f.id} }.to_json
        end
       
      else
        @status={"status-msg"=>"exercise name field cannot be empty"}
      end
    else
      @status={"status-msg"=>"user not exist"}
    end
   
    respond_to do |format|
     format.js { render :json =>@status}
   	end
   	
  end
  #############################################################################
  
  ############################ addWorkout (exercise) ##########################
  def addWorkout
    
    if params[:trained_on]
      @start_date = Time.zone.parse(params[:trained_on]).strftime("%Y-%m-%d")
    else
      @start_date = Time.zone.now.strftime("%Y-%m-%d")
		params[:trained_on]=@start_date
    end

#for calories field data
		if !params[:duration1].nil? && !params[:time_from1].nil? && !params[:duration1].empty? && !params[:time_from1].empty?
			params[:duration]=params[:duration1]
			params[:time_from]=params[:time_from1]
		end

		if params[:calories].nil? || params[:calories]==""
			@workout = Workout.create(:user_id=>params[:userid], :trained_on=>@start_date,:time_from=>params[:time_from])
			@w=WorkoutItem.create(:workout_id=>@workout.id,:exercise_id=>params[:exercise_id],:duration=>params[:duration].delete(" "),:user_id=>params[:userid])

	else
			params[:exercise_id]=809	#this is custom calories execersise id
			 #for activity entry by calories
			 @workout = Workout.create(:user_id=>params[:userid],:trained_on=>@start_date,:time_from=>params[:time_from],:note=>params[:note])
			 @w=WorkoutItem.create(:workout_id=>@workout.id,:exercise_id=>params[:exercise_id],:duration=>params[:duration].delete(" "),:calories=>params[:calories],:user_id=>params[:userid])
end

		if @workout && @w
			 session[:user_id]=params[:userid]
			 @status={"status-msg"=>"success"}
		else  
		 		@status={"status-msg"=>"not created"}
			 end

  respond_to do |format|
       format.js { render :json =>@status.to_json}
   	end
  end
  #############################################################################
  
  
  ############################ addWorkout (exercise) ##########################
  def addMeal

	@user=User.find(params[:id])
	if params[:ate_on]
	   @start_date = Time.zone.parse(params[:ate_on]).strftime("%Y-%m-%d")
	else
	   @start_date = Time.zone.now.strftime("%Y-%m-%d")
 	end

	@serving=params[:units].to_i
	@unit=(params[:units].split(@serving.to_s).length > 1) ? params[:units].split(@serving.to_s)[1] : ""



#		if params[:meal][:calories]==""
    	@meal = @user.meals.create(:ate_on=>@start_date,:meal_type=>params[:meal_type],:time_of_day=>Time.zone.now.strftime("%H-%M-%S"))

			@meal.meal_items.create(:food_id=>params[:food_id],:serving=>@serving,:units=>@unit)
#			else
				#for food custom entry by calory
#				@meal =@user.meals.create(:ate_on=>@start_date,:note => params[:meal][:note],:meal_type=>params[:meal][:meal_type],:time_of_day=>Time.zone.now.strftime("%H-%M-%S"))
#			@meal.meal_items.create(:food_id=>8443,:calories=>params[:meal][:calories])
#		end
		
		if @meal.save
		 @status={"status-msg"=>"Success"}
	  	else
		  @status={"status-msg"=>"Fail"}
		end  
      session[:user_id]=params[:id]

		#respond_to do |format|
	   #  format.js { render :json =>@status.to_json}
   	#end
   	
   	 render :json =>@status.to_json
  end
  #############################################################################
  
 
    def addcustomfood
 
    	@user=User.find(params[:id])
		@params=params[:meals]
		mealsdata=@params.split("**").collect{|a| a}
		mealname=mealsdata[0]
		mealcalorie=mealsdata[1]
		mealserving=mealsdata[0]

		
	   @userfile= params[:userfile]
		@userfile.rewind
		@filename = "#{Rails.root}/public/"+params[:id].to_s+@userfile.original_filename
		 
		 File.open(@filename, "wb") do |file|
			file.write(@userfile.read)
		 end			
		

		@customfood=Food.create(:custom=>true, :name=>mealname,:energ_kcal=>mealcalorie,:gmwt_desc1=>mealserving)
		@customfood.avatar=File.open(@filename)			
		
		if @customfood.save

			 @status={"status-msg"=>"Success"}

		else 
			  if  @customfood.errors.full_messages
				 		@status={"status-msg"=>"taken"} 
			 	else
	  			 	@status={"status-msg"=>"Success"}
	  			 end 
  			end   	
     	session[:user_id]=params[:id]
		File.delete(@filename)
		
	  	respond_to do |format|
	     format.js { render :json =>@status.to_json}
   	end
  end
  
   

  
  ##############################################
  
  def getSession
    if session[:user_id]
      @status=User.find(session[:user_id])  # use this for taking weight of user
    else
      @status={"status-msg"=>"114"}   #114=> not login
    end
 render :json =>@status.to_json   
  # respond_to do |format|
   #  format.js { render :json =>@status.to_json}
  # end
  end
  
  #############################################################################
  
 def userPhotoUpload
  
	if params[:id]
			@userfile= params[:userfile]
			@userfile.rewind
			@filename = "#{Rails.root}/public/"+params[:id].to_s+@userfile.original_filename
	  
	 File.open(@filename, "wb") do |file|
		file.write(@userfile.read)
	 end         
		 
		 @user=User.find(params[:id])
		 @user.avatar=File.open(@filename)
		  
		  if @user.save
		    @status={"status-msg"=>"141"}
		    File.delete(@filename)
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

#############################################################################
 
 def avatar_path
		if session[:user_id]
	  if !User.find(session[:user_id]).avatar_file_name.nil? && User.find(session[:user_id]).avatar_file_name!="NULL"
	 @url=User.find(session[:user_id]).avatar.url(:profile)  
	 @path={"imagepath"=> request.protocol+request.host_with_port+@url}
	  else
	  @path={"imagepath"=> "null"}
	  end   
	else
	 @status={"status-msg"=>"user not exist"}
		end

   respond_to do |format|
     format.js { render :json =>@path.to_json}
   end 
  end

###############################################################  
  def goals
    if params[:id]
      @user=User.find(params[:id])    
      @user.update_attributes(:desired_weight=>params[:desired_weight],:height=>params[:height],:weight=>params[:weight], :activity_level=>params[:activity_level])
      session[:user_id]=@user.id
      @user.calculate_metabolic_rates
      
      if @user.save
        @status={"status-msg"=>"160"}
      else
        @status={"status-msg"=>"161"}  
      end 
    else
      @status={"status-msg"=>"user not exist"}
    end
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end
  
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
#		    @user=User.find(params[:id])
          session[:user_id]=params[:id]
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


 ##################################################################################     
   
     def updateprofile
	@user=User.find(params[:id])
        @user.update_attributes(:first_name=>params[:first_name], :last_name=>params[:last_name],:birthdate=>params[:birthdate],:gender=>params[:gender],:weight=>params[:weight],:height=>params[:height],:city=>params[:city],:state=>params[:state],:username=>params[:username],:email=>params[:email])
   	
       if @user.save
#	   @user=User.find(params[:id])
      session[:user_id]=params[:id]
             @status={"status-msg"=>"160"}
         else
          @status={"status-msg"=>"161"}  
       end 
    
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end

##############################
   def vendordetail
    if params[:vid] && params[:vendor_type]=="restaurants"
	  @vendor=Restaurant.find(params[:vid])
	  	
      else
	  @vendor=Vendor.find(params[:vid])
   end
	@status=@vendor
         session[:user_id]=params[:id]       
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
	      	@status= @data.map{|f| {:id =>f.id, :state=>f.state, :name=>f.business_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}

		else
		@status=nil 
	      end


      elsif params[:searchtype].downcase=="restaurants"

	@data=Restaurant.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(5)
	@data1=Restaurant.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").length

	      if !@data.empty?
	      	@status= @data.map{|f| {:id =>f.id, :state=>f.state, :name=>f.business_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}

		else
		@status=nil 
	      end

      else
           @data=Vendor.where("vendor_type ='"+params[:searchtype].downcase+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").page(params[:page] || 1).per(5)
	   @data1=Vendor.where("vendor_type ='"+params[:searchtype].downcase+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").length

	     if !@data.empty?
	      	@status= @data.map{|f| {:id => f.id, :state=>f.state, :name=>f.business_name, :vendor_type=>f.vendor_type, :datalength=>@data1}}
		else
		@status=nil
	      end
	   end
          session[:user_id]=params[:id]
         respond_to do |format|
           format.js { render :json =>@status.to_json}
         end
      end   
   end


##############################################################weight for graphs

  def weightmeasurement
   	@user=User.find(params[:id])
		@meas=@user.weights.all
			if !@meas.empty?
				@status=@meas
				  else
				@status=nil
			end
		   session[:user_id]=@user.id
		   respond_to do |format|
		     format.js { render :json =>@status.to_json}
		   end	
     end


############################################################################## net calories calculation
  def netcalories
    # creates a date to net calories mapping
		@user=User.find(params[:user_id])
		range=params[:range] 
		@dates=dates_for_graph(range)
      @status= @dates.map{|f| {:date =>f.strftime("%b %d"), :calorie=>@user.net_calories_on(f)}}

						respond_to do |format|
						format.js { render :json =>@status.to_json}
						end	
  end


	def range_to_date_map(range)
			 case range
		 when '1wk'
		   1.week.ago
		 when '2wk'
		   2.weeks.ago
		 when '3wk'
		   3.weeks.ago
		 when '1mth'
		   1.month.ago
		 when '2mth'
		   2.months.ago
		 when '3mth'
		   3.months.ago
		 when '6mth'
		   6.months.ago
		 end
   end
  
  def dates_for_graph(range)
    range = '1wk' if range.nil?
    temp  = Time.zone.today.beginning_of_day
    arr   = [ temp ]
    
    while temp > range_to_date_map( range )
      temp -= 1.day
      
      arr << temp
    end
    arr
  end

##########################################################################

		def photoGallery
       if params[:id]
			@user = User.find(params[:id])
				if params[:type]=="all"
						@photos= @user.photos.all	 					  
					else
						@photos= @user.photos.where("before_after='"+params[:type]+"'")
				end
	 
					if @photos.empty?
					 		@status = nil
						else
						  @status= @photos.map{|f| { :name =>request.protocol+request.host_with_port+f.photo.url}}
				   end
						session[:user_id]=@user.id
						respond_to do |format|
						format.js { render :json =>@status.to_json}
						end	

			else
				 @status = {"status-msg"=>"User not exist"}
			end			
		end



#########################################################################

	def galleryPhotoUpload
	  if params[:id]
			@userfile= params[:userfile]
			@userfile.rewind
			@filename = "#{Rails.root}/public/"+rand(1000000000).to_s+@userfile.original_filename
	  
			 File.open(@filename, "wb") do |file|
				file.write(@userfile.read)
			 end         

		 #@user.photos=File.open(@filename)
		if params[:before_after]=="User_Photo"
					params[:before_after]="user_photo"
						elsif  params[:before_after]=="Photo_Before_Measurement"
					params[:before_after]="before"
				else 
		 	params[:before_after]="after"
		end

		 picture=Photo.new(:photo=> open(@filename), :user_id=>params[:id], :before_after=>params[:before_after])
			  
		  if picture.save
				 @status={"status-msg"=>"141"}
				 File.delete(@filename)
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


##########################################################################
##########################################################################

	def bodymeasurement
	@meas=Measurement.create(params[:measurement])
			if @meas.save
             @status={"status-msg"=>"160"}
         else
          @status={"status-msg"=>"161"}  
       end 
    session[:user_id]=params[:measurement][:user_id]
    respond_to do |format|
     format.js { render :json =>@status.to_json}
    end
  end
###########################################################################

  def measurementDetails
	   	@user=User.find(params[:user_id])
		   @meas=@user.measurements.all
			if !@meas.empty?
				@status=@meas
				  else
				@status=nil
			end
		   session[:user_id]=@user.id
		   respond_to do |format|
		     format.js { render :json =>@status.to_json}
		   end	
	end

#########################################################################################


  def video_category
    @category=Category.all
		respond_to do |format|
		format.js { render :json =>@category.to_json}
		end	
  end

###########################################################################
  
  def video
	if params[:category_id]=="all"
	 @search=OldFlashFile.all
   	if !@search.empty?
	      	@status= @search.map{|f| {:title =>f.title, :imageUrl=>request.protocol+request.host_with_port+f.preview_image.url(:small), :videoUrl=>(f.video.content_type=="video/x-flv") ? "#{request.protocol+request.host_with_port+f.video.url}".gsub(".flv", ".mp4") : "#{request.protocol+request.host_with_port+f.video.url}" ,:videotype=>f.video.content_type}}
		else
			@status=nil 
	 	end

  else
    args={:search=>{:filter=>params[:filter],:category_id=>params[:category_id]}}

    #@latest     = OldFlashFile.order("created_at DESC").limit(2)
    #@medicals   = OldFlashFile.where(:category_id => Category.find_by_name('Medical').id).order("created_at DESC").limit(2)
    #@exercises  = OldFlashFile.where(:category_id => Category.find_by_name('Exercise').id).order("created_at DESC").limit(2)
    #@recipes    = OldFlashFile.where(:category_id => Category.find_by_name('Recipes').id).order("created_at DESC").limit(2)
    #@nutritions = OldFlashFile.where(:category_id => Category.find_by_name('Nutrition').id).order("created_at DESC").limit(2)
  
    @search  = ContentSearch.new(args)  
    @results = Kaminari.paginate_array( @search.results )
    @total   = @search.total
    
 		if !@results.empty?
	      	@status= @results.map{|f| {:title =>f.title, :imageUrl=>request.protocol+request.host_with_port+f.preview_image.url(:small), :videoUrl=>(f.video.content_type=="video/x-flv") ? "#{request.protocol+request.host_with_port+f.video.url}".gsub(".flv", ".mp4") : "#{request.protocol+request.host_with_port+f.video.url}",:videotype=>f.video.content_type}}
	
			else
				@status=nil 
	 	 end
	end
  
    	respond_to do |format|
		format.js { render :json =>@status.to_json}
		end	
  end
  
##################################################################################################

  def show_video
    @video = OldFlashFile.find(params[:id])    
    if @video
		   @status=request.protocol+request.host_with_port+@video.video.url
		 else
		   @status = {"status-msg"=>"Video not exist"}
      end
    
    respond_to do |format|
	 format.js { render :json =>@status.to_json}
	 end	
  end
####################################

 def addWorkout1
 
 render :json=>params
 return 
    if params[:trained_on]
      	@start_date = Time.zone.parse(params[:trained_on]).strftime("%Y-%m-%d")
   	 else
      		@start_date = Time.zone.now.strftime("%Y-%m-%d")
			params[:trained_on]=@start_date
    end

		mets=7.5 #average mets
		weight=User.find(params[:userid]).weights.last.weight
		params[:calories]= 60 * ((mets * 3.5 * weight)/200)
		params[:exercise_id]=809 #this is custom calories execersise id
		params[:note]="running"


 #for activity entry by calories
 @workout = Workout.create(:user_id=>params[:userid],:trained_on=>@start_date,:time_from=>params[:time_from],:note=>params[:note])
 @w=WorkoutItem.create(:workout_id=>@workout.id,:exercise_id=>params[:exercise_id],:duration=>params[:duration].delete(" "),:calories=>params[:calories],:user_id=>params[:userid])

		if @workout && @w
		 		session[:user_id]=params[:userid]
		 			@status={"status-msg"=>"success"}
					else  
 			@status={"status-msg"=>"not created"}
      end

  		respond_to do |format|
       format.js { render :json =>@status.to_json}
   	end
  end




###################################################################

	def bodyfat	
   @user=User.find(params[:bodyfat][:user_id])
	gender=@user.gender
	age=age(@user.birthdate)

 	sum=params[:bodyfat][:chest].to_i+params[:bodyfat][:abdominal].to_i+params[:bodyfat][:thigh].to_i+params[:bodyfat][:subscapular].to_i+params[:bodyfat][:tricep].to_i+params[:bodyfat][:midaxillary].to_i+params[:bodyfat][:suprailiac].to_i

		if gender=="male"
			  bd = (1.12000000-(0.00043499*sum)+(0.00000055*sum)-0.00028826*age).round(4);

					else
				bd = (1.0970 - (0.00046971*sum) + 0.00000056*sum - 0.00012828*age).round(4); 

		end
			fat = (((4.95/bd) - 4.50)*100).round(2);
			params[:bodyfat][:bodyfat]=fat
			bodymass=params[:bodyfat][:bodymass]=100-params[:bodyfat][:bodyfat]
		   @fat=Bodyfat.create(params[:bodyfat])
			if @fat.save
             @status={"status-msg"=>"160","result"=>{"bodyfat"=>fat, "bodymass"=>bodymass}}
            else
           @status={"status-msg"=>"161"}  
       end 
     session[:user_id]=params[:bodyfat][:user_id]
     respond_to do |format|
     format.js { render :json =>@status.to_json}
     end
  end

	def age(dob)
		now = Time.now.utc.to_date
		now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
	end

####################################################################################

 def vendormailer
	if params[:id] && params[:vendor_type]=="restaurants"
	  @vendor=Restaurant.find(params[:id])	  	
      else
	  @vendor=Vendor.find(params[:id])
   end
   BusinessclaimMailer.vendormailer(@vendor,params[:message],params[:email], params[:name]).deliver
      @status={"status-msg"=>"600"}  
        respond_to do |format|
        format.js { render :json =>@status}
      end
 end 


############################################################################################


 def forumlist
   @forumlist=Forem::Forum.all
  	respond_to do |format|
   format.js { render :json =>@forumlist}
   end
 
 end


	def forumtopics
		@forum = Forem::Forum.find(params[:id])
      @results = @forum.topics.visible.by_pinned_or_most_recent_post
	   @topics=@results.map{|f| { :topic_id=>f.id, :subject =>f.subject, :locked=>f.locked, :started_by=>f.posts.try(:last).try(:user)==nil ? "User No longer exist" : "started by "+f.posts.try(:last).try(:user).try(:full_name)}}

  		respond_to do |format|
  		format.js { render :json =>@topics}
		end
		
	end 	

	def topicposts
      #@forum = Forem::Forum.find(params[:forum_id])
	   @topic=Forem::Topic.find(params[:topic_id])
	   @posts=@topic.posts
	   @posts1=@posts.map{|f| { :post=>f.text.html_safe, :created_at =>f.created_at.strftime("%m-%d-%Y"), :topic_id=>f.topic_id, :post_by=>f.try(:user)==nil ? "User No longer exist" : "Post by "+f.try(:user).try(:full_name)}}
	   
  		respond_to do |format|
  		format.js { render :json =>@posts1}
		end
		
	end 



	def postcomment

		@post=Forem::Post.create(:topic_id=>params[:topic_id],:text=>params[:text], :user_id=>params[:user_id])
		if @post.save
	      @status={"status"=>"posted"}	  		
		else
			@status={"status"=>"failed"}
		end

		respond_to do |format|
  		format.js { render :json =>@status}
		end
		
	end

  #this method for testing, to check webservice
  def check

  return

  end  
  
end
