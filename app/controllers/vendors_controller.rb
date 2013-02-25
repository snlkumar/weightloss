class VendorsController < ApplicationController
	before_filter :authenticated_vendor, :only=> [:usersearch,:addmember, :createmember, :memberlist, :addmywwmember,:edit]
#  before_filter :authenticate_vendor!, :only=>[:profile, :search, :show,:new,:create]
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
 #search method end
 


###########################################################################
 ##search for text field decipher
  def search_decipher
   
   if params[:searchtype]=="restaurants"
    	@vendor = Restaurant.where("name like '%"+params[:filterQuery]+"%'")
   		elsif params[:searchtype]!="all"
    		@vendor = Vendor.where("business_name like '%"+params[:filterQuery]+"%' and vendor_type='"+params[:searchtype]+"'")
   	else
    @vendor = Vendor.where("business_name like '%"+params[:filterQuery]+"%'")
   end
   
    if @vendor.empty?
      render :json => [{:value => 'No Results', :id => nil}].to_json
    else
			render :json => @vendor.map{|f| {:value => (params[:searchtype]=="restaurants" ? "#{f.name.capitalize} - Restaurant @$ #{f.address} @$ #{f.city} @$ #{f.state} @$ #{f.zip}" : "#{f.business_name.capitalize} - #{(f.vendor_type).split('_').join(' ')} @$ #{f.address1} @$ #{f.city} @$ #{f.state} @$ #{f.zipcode}"), :id => f.id} }.to_json
    end
  end
 ##end

####################################################################

 def show

   if params[:id] && params[:restaurants]!=nil && params[:restaurants]=="restaurants"
		 @status="true"  #for restaurants
		 	@vendor=Restaurant.find(params[:id])
   		else
			@status="false"
		@vendor=Vendor.find(params[:id])
   end

		@meta=Meta.where("controller= 'Vendors' and  page='Vendor Info'").last
		if !@meta.blank?
		@meta_title=@vendor.business_name
		@meta_keywords=@meta.keywords
		@meta_description=@meta.description+", "+"#{@vendor.business_name}"+","+"#{@vendor.vendor_type}".split('_').join(' ')
		end
 end
  #end show
  
 ##################################################################

	def profile
			
	 @vendor=Vendor.find(params[:id])	 
 	end

  ####################################################################
  		def new
=begin
  		@vendor1=Restaurant.find(:all)
@vendor1.each do |vendor|
@vend=Vendor.create(:business_name=>vendor.business_name, :vendor_type=>"restaurants",
:address1=>vendor.address1,
:b_email=>vendor.b_email,
:city=>vendor.city,
:contact1=>vendor.contact1,
:contact2=>vendor.contact2,
:country=>vendor.country,
:email=>vendor.email,
:fname=>vendor.fname,
:gender=>vendor.gender,
:lname=>vendor.lname,
:p_state=>vendor.p_state,
:password=>"12345678",
:state=>vendor.state,
:status=>vendor.status,
:website_address=>vendor.website_address,
:zipcode=>vendor.zipcode)
@vend.save
end
render :text=> "done"

=end


			@meta=Meta.where("controller= 'Vendor' and  page='Vendor Signup'").last
			if !@meta.blank?
				@meta_title=@meta.metatitle
				@meta_keywords=@meta.keywords
				@meta_description=@meta.description
			end


   	session[:vendor_params] ||= {}
   	 @vendor = Vendor.new(session[:vendor_params])
    	@vendor.current_step = session[:vendor_step]

  end

  #end new
  
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

###########################################################################################

    def create
      session[:vendor_params].deep_merge!(params[:vendor]) if params[:vendor]  
      @vendor = Vendor.new(session[:vendor_params])  
      @vendor.current_step = session[:vendor_step]
        if @vendor.valid?  
		   if params[:back_button]  
		     @vendor.previous_step  
		     elsif @vendor.last_step?
			if @vendor.vendor_type.downcase=="restaurants"
				@rest=Restaurant.new(session[:vendor_params])
				@rest.save
				@vendor=nil
				@vendor=@rest
					@admin =User.where("admin=1")
		      	@admin.each do |admin|
		      	@admin=admin
		  	 		BusinessclaimMailer.newbusiness(@admin, @vendor).deliver
		  	 		end
			else
			      @vendor = Vendor.new(session[:vendor_params])
				   @vendor.save if @vendor.all_valid? 
						@admin =User.where("admin=1")
				   	@admin.each do |admin|
				   	@admin=admin
			  	 		BusinessclaimMailer.newbusiness(@admin, @vendor).deliver 
						end
			end
		else  
		  @vendor.next_step  
		end  
		session[:vendor_step] = "profile" 
        end  
	      if @vendor.new_record?  
		render 'new'  
	      else  
		session[:vendor_step] = session[:vendor_params] = nil  
		flash[:notice] = "vendor saved."  
		redirect_to vendor_path
	  end  
       end  
  #end create

################################################################################# 
 
  def edit
  	if !session[:vendor].nil? 
	  	if session[:vendor].id==params[:id].to_i
			if !session[:vendor].vendor_type.empty? && session[:vendor].vendor_type!="restaurants"
			 	@vendor=Vendor.find(params[:id])
			 else
			 	@vendor=Restaurant.find(params[:id])
			 end
		else
			@vendor=session[:vendor] #for user couldn't access other profile only saw own
		end
	else
     redirect_to(vendorlogin_vendors_path, :notice => 'Please login to process.')          
	end
  end



  def update
  if !session[:vendor].vendor_type.empty? && session[:vendor].vendor_type!="restaurants"
		 @vendor=Vendor.find(params[:id])
		  respond_to do |format|
		   if @vendor.update_attributes(params[:vendor])
		     #format.html { redirect_to(vendorInfo_path(@vendor.id)+"/#{session[:vendor].vendor_type}") }
 	 format.html {	redirect_to "/vendors/profile/#{session[:vendor].vendor_type}/#{session[:vendor].id}/"+"#{session[:vendor].business_name}".gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").gsub('.'," ").strip }
		     format.xml  { head :ok }
		       else
		     format.html { render :action => "edit" }
		     format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
		    end
		   end      
    else
        @vendor=Restaurant.find(params[:id])
		  respond_to do |format|        
         if @vendor.update_attributes(params[:restaurant])
        #format.html { redirect_to(vendorInfo_path(@vendor.id)+"/restaurants"+"/#{session[:vendor].business_name}") }
 	 		format.html {	redirect_to "/vendors/profile/#{session[:vendor].vendor_type}/#{session[:vendor].id}/"+"#{session[:vendor].business_name}".gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").gsub('.'," ").strip }
        format.xml  { head :ok }
           else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @vendor.errors, :status => :unprocessable_entity }
      end
      end
    end
  end

  
  def businessclaim
  params[:businessclaim]
	@cfname= params[:businessclaim][:claimfname]
	@clname= params[:businessclaim][:claimlname]
	@cemail= params[:businessclaim][:claimemail]
	@contact= params[:businessclaim][:claimcontact]
	@vr_id= params[:businessclaim][:vr_id]
	@btype= params[:businessclaim][:business_type]
	@stat= params[:businessclaim][:status]
	
  check=verify_recaptcha(request.remote_ip, params)
	if check[:status] == 'false'
	@captchastatus="false"
	render 'search'
	#redirect_to(vendor_path) 
	  else	 	  
	  @claim=Businessclaim.new(params[:businessclaim])
	   
	  if @claim.save
	  	  
		  if params[:businessclaim][:business_type].downcase=="restaurants"
		  	Restaurant.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")
		  	@business=Restaurant.find(params[:businessclaim][:vr_id])
		  	@admin =User.where("admin=1")
         @admin.each do |admin|
         @admin=admin
		  	 BusinessclaimMailer.businessclaim(@admin, @claim, @business).deliver
		  	 end
		  else
		  	Vendor.find(params[:businessclaim][:vr_id]).update_attributes(:status=>"Pending approval")
		  	@business=Vendor.find(params[:businessclaim][:vr_id])
		  	@admin =User.where("admin=1")
         @admin.each do |admin|
         @admin=admin
		  	 BusinessclaimMailer.businessclaim(@admin, @claim, @business).deliver
		  	 end
		  end
	  		redirect_to(vendor_path, :notice => 'Successfully claimed.')
		else
		  render :action => "new"
		end
	end 
	end


#############################################################

   def vendorlogin
			@meta=Meta.where("controller= 'Vendors' and  page='Vendor Signin'").last
			if !@meta.blank?
			@meta_title=@meta.metatitle
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end
	end


############################################################
	
	def vendorlogin1

	@vendor=Vendor.find_by_sql("select * from vendors where email='"+params[:email]+"'")
	if @vendor!=nil && !@vendor.empty?
		if @vendor.first.password == params[:password] && !params[:password].empty?
	   	session[:vendor]=@vendor.first
      	   #redirect_to (vendorInfo_path(@vendor.first.id)+"/#{session[:vendor].vendor_type}")

 		redirect_to "/vendors/profile/#{session[:vendor].vendor_type}/#{session[:vendor].id}/"+"#{session[:vendor].business_name}".gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").gsub('.'," ").strip
	 
      else
     	  redirect_to(vendorlogin_vendors_path, :notice => 'incorrect password.') 
		end
   else
     @vendor=Restaurant.find_by_sql("select * from restaurants where email='"+params[:email]+"'")
     if @vendor!=nil && !@vendor.empty?
		if @vendor.first.password== params[:password] && !params[:password].empty?
	   	session[:vendor]=@vendor.first
     	   #redirect_to (vendorInfo_path(@vendor.first.id)+"/restaurants"+"/#{session[:vendor].business_name}")
			 redirect_to "/vendors/profile/#{session[:vendor].vendor_type}/#{session[:vendor].id}/"+"#{session[:vendor].business_name}".gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").gsub('.'," ").strip	 
      		else
     	  redirect_to(vendorlogin_vendors_path, :notice => 'incorrect password.') 
		end
     else
       redirect_to(vendorlogin_vendors_path, :notice => 'User not found.')          
	   end
     end
	end

###############################################################################
	
	def logout_vendor
		session[:vendor]=nil
		redirect_to vendorlogin_vendors_path
	end
	


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


#################################################################################


	def usersearch
      if !params[:filterQuery].nil? 
        @data=User.where("first_name like '%"+params[:filterQuery]+"%' or last_name like '%"+params[:filterQuery]+"%' or email like '%"+params[:filterQuery]+"%'").page(params[:page] || 1).per(30)
        end

	end 
	
	
###################################################################################

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


#############################################################################


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

######################################################################################


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
	
####################################################################################	

	def removemember	
	@member=Vendormember.find_by_user_id_and_vendor_id(params[:user_id],params[:vendor_id])
		@member.destroy
		   respond_to do |format| 
			format.html  { render :json =>  "Successfully removed." }      
			format.js  { render :json =>  "Successfully removed." }
			end
		end


############################################################################################	


	def memberlist
#	 @members=Vendormember.find(:all,:conditions=>["userApproved=? and vendor_id=?",true,session[:vendor].id])
		@vendor=Vendor.find(current_vendor.id)
	   @members=@vendor.users.where("userApproved=1").order('first_name ASC').page(params[:page] || 1).per(30)
 
	end

################################################################################################


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

#############################################################################################

  

 def userbodyfat
	 @user=User.find(params[:id])
	 @fat=@user.bodyfats.new 
 end

##########################################################################################


	def  userbodyfatcreate
		@user=User.find(params[:id])
		@fat=@user.bodyfats.create(params[:bodyfat])
			if @fat.save
				  redirect_to(memberdetails_vendors_path(@user)+"?token=#{@user.id}", :notice => 'Bodyfat successfully saved.')
			else
				render "userbodyfat"
			 end
	end	

####################################################################################


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


#########################################################################################3



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

##############################################################################

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

#######################################################################################

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

######################################################################################### 
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
