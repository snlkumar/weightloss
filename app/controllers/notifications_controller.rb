class NotificationsController < ApplicationController


# goal achived notification

	def goalAutoNotifications
 	@notification=Notification.where("notification_type='goal' and turnOnNotification=1").last
		if @notification.present? 	#check if admin has created lunch notification and turnOn the notification
	 	@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		
				@emails.each do |email|
					@user=User.find_by_email("#{email}")
					@userpermission=@user.mywwnotification.goal							
						if @userpermission=="1"#check if user wants goal notifications
						 
							 if @user.mywwnotificaion.goal?						
										if !@user.deseired_weight.present? && !@user.weight.present?	
											if @user.desired_weight >= @user.weight
											  allrecipient << email
											end
								 		end
								end
						end
				end
		mailernotificaton(@notification.message,allrecipient)
		end
	end
	
	
	
	
	
# consecutive 3 days no breakfast entered 
 
  def breakfastAutoNotifications
 	@notification=Notification.where("notification_type='breakfast' and turnOnNotification=1").last
 	
	if @notification.present? 	#check if admin has created lunch notification and turnOn the notification
	 	@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
				@emails.each do |email|
							@user=User.find_by_email("#{email}")
							@userpermission=@user.mywwnotification.breakfast							
						    if @userpermission=="1"#check if user wants breakfast notifications
							
									 	 		bld=@user.meals.where(:ate_on=>["#{Date.today}","#{Date.today-1.day}","#{Date.today-2.day}"] )
													if bld.present?
														breakfast=bld.where(:meal_type=>['7am','8am','9am','11am','10am'])			
				
															if !breakfast.present?	
															allrecipient << email
															
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
																#mailernotificaton(@notification.message, email)
															end						
													else
													      allrecipient << email
																#mailernotificaton(@notification.message, email)
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
													end

								end
				  end
				mailernotificaton(@notification.message,allrecipient)

		  end	
	end
	 
 




# consecutive 3 days no Lunch entered 
 
  def lunchAutoNotifications
 	@notification=Notification.where("notification_type='lunch' and turnOnNotification=1").last
 	
	if @notification.present? 	#check if admin has created lunch notification and turnOn the notification
	 	@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
				@emails.each do |email|
							@user=User.find_by_email("#{email}")
							@userpermission=@user.mywwnotification.lunch							
						    if @userpermission=="1"#check if user wants lunch notifications
							
									 	 		bld=@user.meals.where(:ate_on=>["#{Date.today}","#{Date.today-1.day}","#{Date.today-2.day}"] )
													if bld.present?
														lunch=bld.where(:meal_type=>['12pm','1pm','2pm','3pm','4pm','5pm','6pm'])			
				
															if !lunch.present?	
															allrecipient << email
															
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
																#mailernotificaton(@notification.message, email)
															end						
													else
													      allrecipient << email
																#mailernotificaton(@notification.message, email)
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
													end

								end
				  end
				mailernotificaton(@notification.message,allrecipient)

		  end	
	end





# consecutive 3 days no dinner entered 
 
  def dinnerAutoNotifications
 	@notification=Notification.where("notification_type='dinner' and turnOnNotification=1").last
 	
	if @notification.present? 	#check if admin has created dinner notification and turnOn the notification
	 	@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
				@emails.each do |email|
							@user=User.find_by_email("#{email}")
							@userpermission=@user.mywwnotification.dinner							
						    if @userpermission=="1"#check if user wants dinner notifications
							
									 	 		bld=@user.meals.where(:ate_on=>["#{Date.today}","#{Date.today-1.day}","#{Date.today-2.day}"] )
													if bld.present?
														dinner=bld.where(:meal_type=>['1am','12am','11pm','10pm','9pm','8pm','7pm'])			
				
															if !dinner.present?	
															allrecipient << email
															
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
																#mailernotificaton(@notification.message, email)
															end						
													else
													      allrecipient << email
																#mailernotificaton(@notification.message, email)
																	#BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
													end

								end
				  end
				mailernotificaton(@notification.message,allrecipient)

		  end	
	end






		def mailernotificaton(message, recepient)
			@message=message
			@recepient=recepient
			BusinessclaimMailer.usernotifications(@message,@recepient).deliver 
		end




=begin

 def adminLunchAutoNotifications2222
 	@notification=Notification.where("notification_type='Lunch'").first
 	@emails=@notification.notificationToId.split(",").collect{|a| a }
#  BusinessclaimMailer.usernotifications(@notification.message,@notification.notificationToId).deliver  


		@emails.each do |email|
				@user=User.find_by_email("#{email}") 	
			 	bld=@user.meals.where("ate_on='#{Date.today}'")
					if !bld.nil?
						b=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])			
				
							if b.nil?	
									BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
								#mailernotificaton(@notification.message, email)
							end						
					else
								#mailernotificaton(@notification.message, email)
									BusinessclaimMailer.usernotifications(@notification.message, email).deliver 						
					end
		 end
	  end	





	def breakfastNotifications
		@users=User.find(:all)
		@notificaion="Breakfast is the most important meal of the day !!!"
	   @users.each do |user|
		 if user.mywwnotificaion.breakfast?			
			bld=user.meal.where("ate_on='#{Date.today}'")
					if !bld.nil?
						b=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])			
							if b.nil?
								BusinessclaimMailer.usernotifications(@notification,user).deliver
							end						
					else
								BusinessclaimMailer.usernotifications(@notification,user).deliver			
					end
			end
	  end	     	
	end



	def lunchNotification
		@users=User.find(:all)
		@notificaion="Lunch is the most important meal of the day !!!"
	   @users.each do |user|
		 if user.mywwnotificaion.lunch?			
			bld=user.meal.where("ate_on='#{Date.today}'")
					if !bld.nil?
						l=bld.where(:meal_type=>['12pm','1pm','2pm','3pm','4pm','5pm','6pm'])			
							if b.nil?
								BusinessclaimMailer.usernotifications(@notification,user).deliver
							end						
					else
								BusinessclaimMailer.usernotifications(@notification,user).deliver			
					end
			end
	  end	     	
	end



	def dinnerNotifications
		@users=User.find(:all)
		@notificaion="Dinner is the most important meal of the day !!!"
	   @users.each do |user|
		 if user.mywwnotificaion.dinner?			
			bld=user.meal.where("ate_on='#{Date.today}'")
					if !bld.nil?
						d=bld.where(:meal_type=>['1am','12am','11pm','10pm','9pm','8pm','7pm'])			
							if b.nil?
								BusinessclaimMailer.usernotifications(@notification,user).deliver
							end						
					else
								BusinessclaimMailer.usernotifications(@notification,user).deliver			
					end
			end
	  end	     	
	end

=end




=begin

 def adminLunchAutoNotifications11
 	@notification=Notification.where("notification_type='Lunch'").first
 	@emails=@notification.notificationToId.split(",").collect{|a| a }
#  BusinessclaimMailer.usernotifications(@notification.message,@notification.notificationToId).deliver  


		@emails.each do |email|
				@user=User.find_by_email("#{email}") 	
			 	bld=@user.meals.where("ate_on='#{Date.today}'")
						if !bld.blank?
							b=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])		
								#mailernotificaton(@notification.message, email)
									BusinessclaimMailer.usernotifications("breakfatnot not taken5", email).deliver 						
						else

									BusinessclaimMailer.usernotifications("breakfatnot not taken5", email).deliver 						
						end	



				 end
			  end	     	
 
=end


=begin

	def breakfatNotifications1
		@users=User.find(:all)
	   @users.each do |user|
			bld=user.meal.where("ate_on='#{Date.today}'")

			if user.mywwnotificaion.breakfast?			
				b=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])

				if b.nil?
					notificaion="Breakfast is the most important meal of the day !!!"
					BusinessclaimMailer.usernotifications(notification,user).deliver
				end 
			end
			

			if user.mywwnotificaion.breakfast?						
				l=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])

				
				if b.nil?
					notificaion="Breakfast is the most important meal of the day !!!"
					BusinessclaimMailer.usernotifications(notification,user).deliver
				end 				
			end
			
			
			
			if user.mywwnotificaion.breakfast?									
				b=bld.where(:meal_type=>['7am','8am','9am','11am','12am','10am'])			
				if b.nil?
					notificaion="Breakfast is the most important meal of the day !!!"
					BusinessclaimMailer.usernotifications(notification,user).deliver
				end 								
			end

		end
	     	
	end
=end




	def new
		@notification=Notification.new
	end	


	def create
	 @notification=Notification.create(params[:notification])
	end


end
