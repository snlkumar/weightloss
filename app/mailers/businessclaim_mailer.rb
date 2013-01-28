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
  
  end
