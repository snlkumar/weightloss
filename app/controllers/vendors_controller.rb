class VendorsController < ApplicationController

	
	   before_filter :authenticate_vendor!, :only=> [:usersearch,:addmember, :createmember, :memberlist, :addmywwmember,:edit, :update]


      ####################### Vendor Search #######################################

		def search
		if !params[:searchtype].nil?
		if params[:filterQuery].nil? 
		params[:filterQuery]=""	
		end

		if params[:searchtype]=="all"

		@data=Vendor.where("city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
		@cols="all"

		else

		@data=Vendor.where("vendor_type ='"+params[:searchtype]+"' and (city like '%"+params[:filterQuery]+"%' or state like '%"+params[:filterQuery]+"%' or zipcode like '%"+params[:filterQuery]+"%')").page(params[:page] || 1).per(30)
		@cols="other" 
		end	
		end

		@meta=Meta.where("controller= 'Vendors' and  page='Vendor Search'").last
		if !@meta.blank?
		@meta_title=@meta.metatitle
		@meta_keywords=@meta.keywords
		@meta_description=@meta.description
		end
		end


	  ################################# Vendor Info Page ####################
 
 
		def show

		@vendor=Vendor.find(params[:id])

		@meta=Meta.where("controller= 'Vendors' and  page='Vendor Info'").last
		if !@meta.blank?
		@meta_title=@vendor.business_name
		@meta_keywords=@meta.keywords
		@meta_description=@meta.description+", "+"#{@vendor.business_name}"+","+"#{@vendor.vendor_type}".split('_').join(' ')
		end
		end
 
  #end show
  
 		######################### Vendor Profile Page ############################


		def profile			
		@vendor=Vendor.find(params[:id])	 
		render :layout=>'vendorprofile'
		end


  		##########################  Vendor Signup Second Step   ###################


		def second_step
		render :layout => 'signup' 
		end


      #########################  Vendor Signup Second Step  ###################

		

		def final

		if current_vendor.update_attributes(params[:vendor])

		current_vendor.save # TODO: needed?
		redirect_to profile_vendors_path(current_vendor)
		else

		render :action => :second_step, :layout => 'signup'
		end
		end



		###################################################################

  
		def captchatest
		elements=Hash.new
		elements={:recaptcha_response_field => params[:xxx], :recaptcha_challenge_field => params[:vvv]}
		check=verify_recaptcha(request.remote_ip, elements)

		if check[:status] == 'false'
		render :text=> "false"
		return
		else
		render :text=> "true"
		return
		end
		end



		###############################  Vendor Edit ############################################ 
 
		def edit

		@vendor=Vendor.find(params[:id])
	
		end


		###############################  Vendor Update  ######################################### 
		
		def update
		@vendor=Vendor.find(params[:id])
		respond_to do |format|
		if @vendor.update_attributes(params[:vendor])
		#format.html { redirect_to(vendorInfo_path(@vendor.id)+"/#{session[:vendor].vendor_type}") }
		format.html {	redirect_to profile_vendors_path(current_vendor) }
		format.xml  { head :ok }
		else
		format.html { render :action => "edit" }
		format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
		end
		end      
		end
  
		###############################  Business Claim  #########################################   
  
		def businessclaim
		params[:businessclaim]
		@cfname= params[:businessclaim][:claimfname]
		@clname= params[:businessclaim][:claimlname]
		@cemail= params[:businessclaim][:claimemail]
		@contact= params[:businessclaim][:claimcontact]
		@vendor_id= params[:businessclaim][:vendor_id]
		@btype= params[:businessclaim][:business_type]
		@stat= params[:businessclaim][:status]

		check=verify_recaptcha(request.remote_ip, params)
		if check[:status] == 'false'
		@captchastatus="false"
		render 'search'
		#redirect_to(vendor_path) 
		else	 	  
		@claim=Businessclaim.new(params[:businessclaim])
		@business=Vendor.find(params[:businessclaim][:vendor_id])	   
		if @claim.save
		@business.update_attributes(:status=>"Pending approval") # devise not updating it if email is blank........
		@admin =User.where("admin=1")
		@admin.each do |admin|
		@admin=admin
		BusinessclaimMailer.businessclaim(@admin, @claim, @business).deliver
		end

		redirect_to(vendor_path, :notice => 'Successfully claimed.')
		else
		render :action => "new"
		end
		end 
		end


		#######################  Auto Ajax Search in Vendor Signup and Edit ##########################



		def auto_search
		@city=ActiveRecord::Base.connection.execute("select c.id, c.name,co.name from City c, Country co where c.name like '%"+params[:search]+"%' and c.countrycode=co.code")
		render :json =>@city
		return
		end 


		def auto_search1
		@colleges=ActiveRecord::Base.connection.execute("select c.id, c.colleges from colleges c where c.colleges like '%"+params[:search]+"%'")
		render :json =>@colleges
		return
		end 

		def auto_search2
		@degrees=ActiveRecord::Base.connection.execute("select c.id, c.degrees from degrees c where c.degrees like '%"+params[:search]+"%'")
		render :json =>@degrees
		return
		end 


		#################################### Vendor User Search  #########################


		def usersearch
		if !params[:filterQuery].nil? 
		@data=User.where("first_name like '%"+params[:filterQuery]+"%' or last_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(15)
		end

		end 
	
	
		#########################  Add Vendor member Weight ##########################

		def userweight
		@weight=Weight.create(:weight=>params[:weight],:user_id=>params[:user_id])
		@user=User.find(params[:user_id])

		respond_to do |format|
		if @weight.save	
		format.html { render :json => "weight saved." }	
		format.js  { render :json => "weight saved." }	
		end
		end
		end


		###############################Add Myweight World Users #######################


		def addmywwmember 
		@vendor=Vendor.find(current_vendor.id)
		@membership=Vendormember.find_by_user_id_and_vendor_id(params[:user_id], current_vendor.id)


		if @membership.nil?

		@member=Vendormember.create(:user_id=>params[:user_id], :vendor_id=>current_vendor.id, :userApproved=>false, :status=>"waiting")
		@user=User.find(params[:user_id])
		respond_to do |format|
		if @member.save
		@notification=@vendor.notifications.create(:notificationTo=>"User",:notificationToId=>params[:user_id], :message=> params[:message])
		BusinessclaimMailer.delay.mywwmembership(@user, @vendor)      

		format.html { render :json => "Successfully sent a notification to user. Please wait for the approval." }		   
		format.js  { render :json => "Successfully sent a notification to user. Please wait for the approval." }
		else
		format.html  { render :json => @member.errors.full_messages.first }		   		   
		format.js  { render :json =>  @member.errors.full_messages.first }
		end
		end

		else

		if @membership.status=="waiting"
		respond_to do |format|
		format.html { render :json => "Already Waiting approval." }		   
		format.js  { render :json => "Already Waiting approval." }
		end
		end
		end
		end

      ################################## Add new User by Vendor ###############################


		def addmember
		@member=User.new
		end



		def createmember

		@member=User.create(params[:user])
		@vendor=Vendor.find(current_vendor.id)
		if @member.save
		@weight=Weight.create(:weight=>params[:user][:weight],:user_id=>@member.id)
		@membership=Vendormember.create(:user_id=>@member.id, :vendor_id=>current_vendor.id, :userApproved=>true,:status=>"approved")	
		BusinessclaimMailer.newaddedmywwuser(@member, @vendor,params[:user][:password]).deliver       	
		redirect_to(memberlist_vendors_path, :notice => 'User created.')
		else
		render 'addmember'
		end
		end
	
   	################################## Remove user for membership ################################	

		def removemember	
		@member=Vendormember.find_by_user_id_and_vendor_id(params[:user_id],params[:vendor_id])
		@member.destroy
		respond_to do |format| 
		format.html  { render :json =>  "Successfully removed." }      
		format.js  { render :json =>  "Successfully removed." }
		end
		end


		############################### Member List ###########################################	


		def memberlist
		#@members=Vendormember.find(:all,:conditions=>["userApproved=? and vendor_id=?",true,session[:vendor].id])
		@vendor=Vendor.find(current_vendor.id)
		@members=@vendor.users.where("userApproved=1").order('first_name ASC').page(params[:page] || 1).per(30)

		end

		################################# Member details ######################################


		def memberdetails
		@user=Vendormember.find_by_user_id_and_vendor_id_and_userApproved(params[:token], current_vendor.id,true)
		if @user!=nil
		@user=User.find(params[:id])
		@vendor=current_vendor
		@weights=@user.weights.limit(50).order('created_at ASC')
		@bodyfats=@user.bodyfats.limit(50).order('created_at ASC')
		@measuremets=@user.measurements.limit(50).order('created_at DESC')
		@ratings=Rating.find_by_ratingFor_and_ratingForid_and_ratingable_type_and_ratingable_id("user",@user.id,"Vendor",current_vendor.id)

		if @ratings.nil?
		@rating=1
		else
		@rating=@ratings.rating					
		end		
		else
		render :file => "#{Rails.root}/public/404.html", :status => :not_found
		end
		end

		############################### Create Member Bodyfat by Vendor   ##################

  

		def userbodyfat
		@user=User.find(params[:id])
		@fat=@user.bodyfats.new 
		end




		def  userbodyfatcreate
		@user=User.find(params[:id])
		@fat=@user.bodyfats.create(params[:bodyfat])
		if @fat.save
		redirect_to(memberdetails_vendors_path(@user)+"?token=#{@user.id}", :notice => 'Bodyfat successfully saved.')
		else
		render "userbodyfat"
		end
		end	

		############################### Create Member Measurements by Vendor   ##################


		def usermeasurementnew
		@user=User.find(params[:id])
		@meas=@user.measurements.new 
		end



		def  usermeasurementcreate
		@user=User.find(params[:id])
		@meas=@user.measurements.create(params[:measurement])
		if @meas.save
		redirect_to(memberdetails_vendors_path(@user)+"?token=#{@user.id}", :notice => 'Measurement successfully saved.')
		else
		render "usermeasurement"
		end
		end	


		############################### Create Vendor Notifications to Members    ##################


		def vendorNotificationsNew
		@vendor=current_vendor
		@notification = Notification.new
		@members=current_vendor.users.where("userApproved=1").order('first_name ASC')
		render :layout=>'vendorprofile'
		end



		def vendorNotificationsCreate

	params[:notification][:notificationToId]=params[:notificationToId].collect{|a| a.split(",") }.join(",").to_s

		if params[:notificationFrequency]=="first"
		
		  if params[:notificationFrequency1].to_s=="day"
			  params[:notification][:notificationFrequency]="#{(24/params[:times].to_f).round(2)}"+".hours"
		  elsif params[:notificationFrequency1].to_s=="week"
			  params[:notification][:notificationFrequency]="#{24*7/params[:times].to_f}"+".hours"				
		  elsif params[:notificationFrequency1].to_s=="month"
			  params[:notification][:notificationFrequency]="#{24*30/params[:times].to_f}"+".hours"
		  else
			  params[:notification][:notificationFrequency]="#{(24*30*12/params[:times].to_f).round(2)}"+".hours"
		  end
		  
           params[:notification][:frequency_type]="first"				 	
		else

           params[:notification][:notificationFrequency]=params[:notificationFrequency2].split(",").sort.collect{|a| a.to_s.strip+".days" }.join(",").to_s
		     params[:notification][:frequency_type]="second"
		end
		
		if params[:notification][:notification_type]=="food"
	     params[:notification][:mealslist]=params[:meals1].collect{|a| a.split(",") }.join(",").to_s
		end			


		if params[:notification][:notification_type]=="food_type"
	     params[:notification][:food_category]=params[:food_category].collect{|a| a.split(",") }.join(",").to_s	    
		end				

	
		if params[:notification][:notification_type]=="activity"
		  params[:notification][:exerciseslist]=params[:exercise1].collect{|a| a.split(",") }.join(",").to_s	
		  params[:notification][:workoutduration]=params[:workoutduration]				
		end



		if params[:notificationPeriodUnit]=="days"
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.days.from_now		
		elsif params[:notificationPeriodUnit]=="weeks"
	   	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.weeks.from_now		
		elsif params[:notificationPeriodUnit]=="months"
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.months.from_now		
		else
      	params[:notification][:notificationDuration]=params[:notificationPeriod].to_i.years.from_now		
		end
	

		 	
    @notification = Notification.create(params[:notification])
    	 if @notification.save
  
#writing schedule and rake task file
		Notification.updateCronTab
						       
      redirect_to( profile_vendors_path(current_vendor), :notice => 'Notification was successfully created.')
    else
      render :action => "vendorNotificationsNew"
    end

		end

		##############################  Notification to users ######################################

=begin

		def notifications

		@user=User.find(params[:notificatonToId])
		@vendor=current_vendor
		@notification=@vendor.notifications.create(:notificationTo=>"User",:notificationToId=>params[:notificatonToId], :message=> params[:message])
		respond_to do |format|
		if @notification.save	
		format.html { render :json => "Message sent." }	
		format.js  { render :json => "Message sent." }	
		end
		end

		end

=end

		############################# Star Rating to User (create and update) ##########################

		def ratings

		@vendor=Vendor.find(current_vendor.id)
		@rating=Rating.find_by_ratingable_id_and_ratingable_type_and_ratingForid(current_vendor.id,"Vendor",params[:userid])
		if @rating==nil	
		@rating=@vendor.ratings.create(:ratingForid=>params[:userid], :rating=>params[:rating], :ratingFor=>"user")
		respond_to do |format|
		if @rating.save
		format.html { render :json => "Rating created." }		   
		end
		end
		else
		@rating.update_attributes(:rating=>params[:rating])
		respond_to do |format|
		if @rating.save
		format.html { render :json => "Rating updated." }		   
		end
		end
		end 

		end

		###########################  Member Workout and meal diary  ##################################

		def userdiary
		@user=User.find(params[:id])
		if params[:date_on] && params[:date_on].downcase!="today"
		@start_date = Time.zone.parse(params[:date_on]).strftime("%Y-%m-%d")
		else
		@start_date = Time.zone.now.strftime("%Y-%m-%d")
		end

		@workouts=Workout.find_by_sql("SELECT wi.exercise_id,w.id,e.description,wi.calories,w.time_from,w.note,w.trained_on FROM exercises e ,workout_items wi, workouts w  WHERE w.user_id="+@user.id.to_s+" and trained_on='"+@start_date+"' and wi.exercise_id=e.id and w.id=wi.workout_id")

		@meals = Meal.find_by_sql("SELECT mi.food_id,m.id,f.name,m.meal_type,m.note,ifnull(mi.calories,0) as calories,ifnull(f.lipid_tot,0) as fat,ifnull(f.carbohydrt,0) as carbohydrt,ifnull(f.protein,0) as protein,m.ate_on from meals m,meal_items mi,foods f where f.id=mi.food_id and m.id = mi.meal_id and m.user_id=" + @user.id.to_s + " and m.ate_on='"+ @start_date.to_s+"'")


		@meals.each do |f|
		if(f.food_id!=8443)
		f.fat= calculate_calories(f.food_id,f.calories,"fat") 
		f.carbohydrt=calculate_calories(f.food_id,f.calories,"carbohydrt") 
		f.protein=calculate_calories(f.food_id,f.calories,"protein")
		end
		end

		end
		

		############################## Calculating fat carb etc. in meals  ######################################### 


		def calculate_calories(fid, calories, type)

		@food=Food.find(fid)
		times=calories/@food.energ_kcal
		if !@food.custom

		case type
		
		when 'fat'
		calories       = (@food.lipid_tot.to_f * times)
		when 'carbohydrt'
		calories       = (@food.carbohydrt.to_f * times) 
		when 'protein'
		calories       = (@food.protein.to_f * times) 						
		end

		else
		
		times=calories/@food.energ_kcal
		case type
		
		when 'calorie'
		calories       = @food.energ_kcal.to_f* times
		when 'fat'
		calories       = @food.total_fat.to_f * times
		when 'carbohydrt'
		calories       = @food.carbohydrt.to_f * times
		when 'protein'
		calories       = @food.protein.to_f * times
		when 'fiber_td'
		calories       = @food.fiber_td.to_f * times
		end
		end
		return calories.round(2) unless calories.nil? 

		end		
		
		
		#######################################################################################



end
