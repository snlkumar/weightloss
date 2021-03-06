class BusinessclaimMailer < ActionMailer::Base
include SendGrid
  default :from => "noreply@myweightworld.com"
   
	def rejected(claim, business)
		@claim = claim
		@business= business
		mail(:from => "noreply@myweightworld.com", :to => @claim.claimemail, :subject => "Business claim status")
	end
  
	def accepted(claim, business)
		@claim = claim
		@business= business
		mail(:from => "noreply@myweightworld.com", :to => @claim.claimemail, :subject => "Business claim status")
	end
 
 
  
	def businessclaim(admin, claim, business)
		@claim = claim
		@admin = admin
		@business= business
		mail(:from => "noreply@myweightworld.com", :to => @admin.email, :subject => "New business claim")
	end 


  
	def newbusiness(admin, vendor)
		@vendor = vendor
		@admin = admin
		mail(:from => "noreply@myweightworld.com", :to => @admin.email, :subject => "New business added")
	end

  
	def vendormailer(vendor, message, email, name)
		@vendor=vendor
		@name=name
		@email="#{@vendor.email}"
		@text=message
		@contact=email
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Client Query (MyweightWorld.com)")
	end
 
  
  
  def mywwmembership(user,vendor)
    @user = user
    @vendor= vendor
    mail(:from => "noreply@myweightworld.com", :to => @user.email, :subject => "Membership")   
  end



  
  def newaddedmywwuser(user,vendor,password)
    @password=password
	 @user = user
	 @vendor= vendor
	 mail(:from => "noreply@myweightworld.com", :to => @user.email, :subject => "Membership") 
  end
  
  
	def usernotifications(message,email)
    @message=message
	 @email =email
	 mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Notification") 
  end
  



	def weightcheck(message , email, amount)
		@message=message
		@email=email
		@amount=amount
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Weight Tracker Notification")
	end  
 
 
 
	def caloriecheck(message , email, amount)
		@message=message
		@email=email
		@amount=amount
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Calorie Tracker Notification")
	end  

 
 
	def fatcheck(message , email, amount)
		@message=message
		@email=email
		@amount=amount
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Fat Tracker Notification")
	end   
 
 
  
	def foodcheck(message, email,foodids)
		@message=message
		@email=email
		@foodids=foodids
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Meal Tracker Notification")
		
	end

  
	def workoutscheck(message, email,workoutids)
		@message=message
		@email=email
		@workoutids=workoutids
		mail(:from => "noreply@myweightworld.com", :to => @email, :subject => "Workout Tracker Notification")
		
	end

  
end
