class NotificationsController < ApplicationController

=begin
		########################## goal achived notification  #######################################

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
	
	
	
	
	
		############################## consecutive 3 days no breakfast entered ########################
 
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
		end						
		else
		allrecipient << email

		end

		end
		end
		mailernotificaton(@notification.message,allrecipient)

		end	
		end
	 


		###################### consecutive 3 days no Lunch entered ################################

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

		end						
		else
		allrecipient << email

		end

		end
		end
		mailernotificaton(@notification.message,allrecipient)

		end	
		end



		####################### consecutive 3 days no dinner entered ################################
 
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

		end						
		else
		allrecipient << email

		end

		end
		end
		mailernotificaton(@notification.message,allrecipient)

		end	
		end


		#####################################  Protein notification #################################
		
		def proteinNotifications
		@notification=Notification.where("notification_type='protein' and turnOnNotification=1")


		if @notification.present? 	#check if admin has created protein notification and turnOn the notification
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		@userpermission=@user.mywwnotification.protein							
		if @userpermission=="1"#check if user wants protein notifications							
		bld=@user.meals.where(:ate_on=>["#{Date.today}","#{Date.today-1.day}","#{Date.today-2.day}"] )
		if bld.present?
		#checking for food id
		bld.each do |f|
		protein+=f.protein
		end
				
		if protein < 100
		allrecipient << email											
		end	

		else
		allrecipient << email
		end
		end
		end     
		mailernotificaton(@notification.message,allrecipient)

		end	
		end



=end

		######################## Weight loss do/dont ##############################

		def weightAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)
		if @notification.present?
		
		
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		checkweight= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")

										if @notification.duration=="week"
										@weights=@user.weights.past_week
										elsif @notification.duration=="month"
										@weights=@user.weights.past_month
										else 
										@weights=@user.weights.today
										end
		
		

			if @weights.length>1
			@weightloss=@weights.first.weight-@weights.last.weight
										if @notification.do_dont=="1"


											if (@weightloss + @notification.amount.to_i ) <=0 # if weight loss amount mentioned achieved... email will be sent....
											checkweight << email
											end

										else

											if (@weightloss + @notification.amount.to_i ) > 0 # if weight loss amount mentioned not achieved... email will be sent....
											checkweight << email										 
											end

										end

			else
			BusinessclaimMailer.weightcheck("Plase keep updating your weights to track your progress....",email,@notification.amount.to_i).deliver 
			end

		end
			BusinessclaimMailer.weightcheck(@notification.message,checkweight,@notification.amount.to_i).deliver if  checkweight.present?
		end
		end
		
		############################  Calories #########################
		
		def caloriesAutoNotifications(id)		
		notification=id
		@notification=Notification.find(notification)
		if @notification.present?
		

		@emails=@notification.notificationToId.split(",").collect{|a| a }
		checkcalories= []		
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		
						if @notification.duration=="week"
						   @netcalories=@user.calories_consumed_this_week
						elsif @notification.duration=="month"
							@netcalories=@user.calories_consumed_this_month
						else 
							@netcalories=@user.calories_consumed_today
						end		
		
		
					
						if @notification.do_dont=="1"
							if @netcalories >=@notification.amount.to_i # if calorie loss amount mentioned achieved... email will be sent....
								checkcalories << email
							end
						else

							if @netcalories < @notification.amount.to_i  # if calorie loss amount mentioned not achieved... email will be sent....
							checkcalories << email
							end			
						end

		end

		BusinessclaimMailer.caloriecheck(@notification.message,checkcalories,@notification.amount).deliver if checkcalories.present?
			
		end		
		end
				
		
		##########################	 Bodyfat   ##########################

		def bodyfatAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)		
		if @notification.present?

		@emails=@notification.notificationToId.split(",").collect{|a| a }
		checkfat= []		
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		
						if @notification.duration=="week"
						   @bodyfat=@user.bodyfats.past_week
						elsif @notification.duration=="month"
							@bodyfat=@user.bodyfats.past_month
						else 
							@bodyfat=@user.bodyfats.today
						end			
		
		
			if @bodyfat.length>1
						@fatloss=@bodyfat.first.fatpercent-@bodyfat.last.fatpercent


						if f.do_dont=="1"
							if @fatloss>=@notification.amount.to_i  # if calorie loss amount mentioned achieved... email will be sent....
							checkfat << email
							end
						else

							if @fatloss<=@notification.amount.to_i # if calorie loss amount mentioned not achieved... email will be sent....
							checkfat << email
							end			
						end
						

			else
			BusinessclaimMailer.fatcheck("Plase keep updating your bodyfat to track your progress....",email,@notification.amount.to_i).deliver 
			end
						

		end
		
			BusinessclaimMailer.fatcheck(@notification.message,checkfat, @notification.amount.to_i ).deliver if checkfat.present?		
				
		end
		end

		#############################  Supplements  ###################################

		def supplementsAutoNotifications
		
		
		end

		############################## Food ############################################


		
		def foodAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)		
									if @notification.present?

		@emails=@notification.notificationToId.split(",").collect{|a| a }

		@foodids=@notification.mealslist.split(",").collect{|a| a.to_i }

		checkfood=[]
		mealids=[]
				@emails.each do |email|
				@user=User.find_by_email("#{email}")
				
				
							if @notification.duration=="week"
							meals=@user.meals.past_week
							elsif @notification.duration=="month"
							meals=@user.meals.past_month
							else 
							meals=@user.meals.today
							end	
	
			
							 if meals.present?

									meals.each do |p|
									@mealids=MealItem.find_by_meal_id(p.id,:select=>:food_id)
									mealids << @mealids.food_id
									end

									if @notification.do_dont=="1"											
								
										@remain=@foodids-mealids
										if @remain.length==0	
										checkfood << email
										end						 

									else

										@remain=@foodids-mealids

										if @remain.length!=0										
										checkfood << email
										end
									end

							else
							BusinessclaimMailer.foodcheck(@notification.message,email,@foodids).deliver
					      end	
				end		

			BusinessclaimMailer.foodcheck(@notification.message,checkfood,@foodids).deliver if checkfood.present?										 


			end
		end


		#################################### Workout ############################


		
		def activityAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)	

		if @notification.present?

		@emails=@notification.notificationToId.split(",").collect{|a| a }
		@exerciseids=@notification.exerciseslist.split(",").collect{|a| a }

		checkworkouts= []
		workoutids=[]
					@emails.each do |email|
					@user=User.find_by_email("#{email}")

				
							if @notification.duration=="week"
							workouts=@user.workouts.past_week
							elsif @notification.duration=="month"
							workouts=@user.workouts.past_month
							else 
							workouts=@user.workouts.today
							end


									if workouts.present?

												workouts.each do |f|
												@workouts=WorkoutItem.find_by_workout_id(f.id,:select=>:exercise_id)
												workoutids << @workouts.exercise_id
												end

												if @notification.do_dont=="1"
													@remain=@exerciseids-workoutids

													if @remain.length==0
													checkworkouts << email
													end						 
												else
													@remain=@exerciseids-workoutids
													if @remain.length!=0
													checkworkouts << email
													end
												end

									else
									BusinessclaimMailer.workoutscheck(@notification.message,email,@exerciseids ).deliver

									end	
					end		
					BusinessclaimMailer.workoutscheck(@notification.message,checkworkouts,@exerciseids).deliver	if checkworkouts.present?									 


		end
		end


		#################################### General notifications #######################
		

		def otherAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)	
		
		if @notification.present?
#		@notification.each do |f|
#		if f.nextrundate=Date.today

		@emails=f.notificationToId
		BusinessclaimMailer.usernotifications(@message,@emails).deliver										 

#		end
#		end	

		end
		end

		
		########################### mailer ###############################################
	
	
		
		def mailernotificaton(message, recepient)
		@message=message
		@recepient=recepient
		BusinessclaimMailer.usernotifications(@message,@recepient).deliver 
		end




		##################################################################################

		def checknoti
		@notification=Notification.find(45)
		if @notification.present?

		@emails=@notification.notificationToId.split(",").collect{|a| a }
		@exerciseids=@notification.exerciseslist.split(",").collect{|a| a }

		checkworkouts= []
		workoutids=[]
					@emails.each do |email|
					@user=User.find_by_email("#{email}")

				
									if @notification.duration=="week"
									workouts=@user.workouts.past_week
									elsif @notification.duration=="month"
									workouts=@user.workouts.past_month
									else 
									workouts=@user.workouts.today
									end



									if workouts.present?

												workouts.each do |f|
												@workouts=WorkoutItem.find_by_workout_id(f.id,:select=>:exercise_id)
												workoutids << @workouts.exercise_id
												end

												if @notification.do_dont=="1"
													@remain=@exerciseids-workoutids

													if @remain.length==0
													checkworkouts << email
													end						 
												else
													@remain=@exerciseids-workoutids
													if @remain.length!=0
													checkworkouts << email
													end
												end

									else

									BusinessclaimMailer.workoutscheck(@notification.message,email,@exerciseids ).deliver

									end	
					end	
						
					BusinessclaimMailer.workoutscheck(@notification.message,checkworkouts,@exerciseids).deliver	if checkworkouts.present?									 
		end
		end

		
		
end
