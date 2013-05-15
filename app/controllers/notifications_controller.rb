class NotificationsController < ApplicationController

		###########  searching food from notification settings  ##################################
		
		 def autoUserSearch		
			terms  = params[:q].split(/,|\s/).reject(&:blank?)
			conds  = terms.collect{|t| "first_name or last_name LIKE ?"}.join(' AND ')
			if current_user
			@users = User.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
			else
			@allusers = current_vendor.users.where("userApproved=1")
			@users= @allusers.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
			
			end
			if @users.empty?
			render :json => [{:value => 'No Results', :id => nil}].to_json
			else

			render :json => @users.map{|f| {:value =>"#{f.full_name}", :id => f.email} }.to_json
			end	
		
		end



		###########  searching food from notification settings  ##################################
		
		 def autoMealSearch		
			terms  = params[:q].split(/,|\s/).reject(&:blank?)
			conds  = terms.collect{|t| "shrt_desc LIKE ? and adminApproved=1"}.join(' AND ')
			@foods = Food.with_a_serving_size.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])

			if @foods.empty?
			render :json => [{:value => 'No Results', :id => nil}].to_json
			else

			render :json => @foods.map{|f| {:value =>f.name, :id => f.id} }.to_json
			end	
		
		end
		
		
		###########  searching exercise from notification settings #################################
		
		 def autoExerciseSearch
		    terms     = params[:q].split(/,|\s/).reject(&:blank?)
			 # category LIKE :#{in_words} OR 
			 conds     = terms.enum_with_index.map{|t, index| in_words = index.to_s.en.numwords; "description LIKE :#{in_words}"}.join(' AND ')
			 term_hash = {}
			 
			 terms.each_with_index{|term, index| term_hash[index.to_s.en.numwords.to_sym] = "%#{term}%"}
 
          @exercises = Exercise.find(:all, :conditions => [conds, term_hash])

			if @exercises.empty?
			render :json => [{:value => 'No Results', :id => nil}].to_json
			else
			render :json => @exercises.map{|f| {:value =>f.description, :id => f.id} }.to_json
			end
		
		end


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

=end

	
		#####################################  Protein notification #################################
		
		def proteinAutoNotifications(id)
		notification=id
		@notification=Notification.find_by_id(notification)

		if @notification.present? 	#check if admin has created protein notification and turnOn the notification
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
				
			if @notification.duration=="week"
			@meals=@user.meals.past_week
			elsif @notification.duration=="month"
			@meals=@user.meals.past_month
			else 
			@meals=@user.meals.today
			end

	    # @proteinConsumed=@meals.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += (Food.find(meal_item.food_id).protein.nil? ? 0 : Food.find(meal_item.food_id).protein*(meal_item.calories/Food.find(meal_item.food_id).energ_kcal)) } }.round(3)

			@proteinConsumed=@meals.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += (Food.find_by_id(meal_item.food_id).try(:protein).nil? ? 0 : ( Food.find_by_id(meal_item.food_id).try(:energ_kcal).nil? ? 0 : Food.find_by_id(meal_item.food_id).try(:protein)*(meal_item.calories/Food.find_by_id(meal_item.food_id).try(:energ_kcal) ))) } }.to_f.round(3)

			if @proteinConsumed.present? 
			#checking for food id
				
				if @notification.do_dont=="1"
					if @proteinConsumed >= @notification.amount.to_f # if protein consumed amount mentioned achieved... email will be sent....
					allrecipient << email
					end
				else
					if @proteinConsumed < @notification.amount.to_f # if protein consumed amount mentioned notachieved... email will be sent....
					allrecipient << email
					end		
				end	

			else
			allrecipient << email
			end


		end     
			BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
		   rescheduleDates(notification) if @notification.frequency_type=="second"

		end	
		end



		#####################################  Carbohydrate notification #################################
		
		def carbohydrateAutoNotifications(id)
		notification=id
		@notification=Notification.find_by_id(notification)

			if @notification.present? 	#check if admin has created protein notification and turnOn the notification
			@emails=@notification.notificationToId.split(",").collect{|a| a }
			allrecipient= []
			@emails.each do |email|
			@user=User.find_by_email("#{email}")
				
			if @notification.duration=="week"
			@meals=@user.meals.past_week
			elsif @notification.duration=="month"
			@meals=@user.meals.past_month
			else 
			@meals=@user.meals.today
			end

	    # @proteinConsumed=@meals.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += (Food.find(meal_item.food_id).protein.nil? ? 0 : Food.find(meal_item.food_id).protein*(meal_item.calories/Food.find(meal_item.food_id).energ_kcal)) } }.round(3)

			@proteinConsumed=@meals.inject(0){|tot, meal| tot += meal.meal_items.inject(0){|meal_tot, meal_item| meal_tot += (Food.find_by_id(meal_item.food_id).try(:carbohydrt).nil? ? 0 : ( Food.find_by_id(meal_item.food_id).try(:energ_kcal).nil? ? 0 : Food.find_by_id(meal_item.food_id).try(:carbohydrt)*(meal_item.calories/Food.find_by_id(meal_item.food_id).try(:energ_kcal) ))) } }.to_f.round(3)

			if @proteinConsumed.present? 
			#checking for food id
				
				if @notification.do_dont=="1"
					if @proteinConsumed >= @notification.amount.to_f # if protein consumed amount mentioned achieved... email will be sent....
					allrecipient << email
					end
				else
					if @proteinConsumed < @notification.amount.to_f # if protein consumed amount mentioned notachieved... email will be sent....
					allrecipient << email
					end		
				end	

			else
			allrecipient << email
			end


		end     
			BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
		   rescheduleDates(notification) if @notification.frequency_type=="second"

		end	
		end






		############################# Meals Per day ##########################
		
		def mealperdayAutoNotifications(id)
		notification=id
		@notification=Notification.find_by_id(notification)
		if @notification.present?
		@email=@notification.notificationToid.split(",").collect{|a| a}
		allrecipient=[]
		
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-1}'")
		
			if @notification.do_dont=="1"
				if bld.size >= @notification.amount.to_i
				allrecipient << email
				end		
			else
				if bld.size < @notification.amount.to_i
				allrecipient << email
				end			
			end
				
		end
			BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
		   rescheduleDates(notification) if @notification.frequency_type=="second"
							
		end			
		end		

	
	
		############################## Inactive Diary ########################	
	
		def inactivityAutoNotifications(id)
		notification=id
		@notification=Notification.find_by_id(notification)
		if @notification.present?
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")


		#bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-5.days}'" )

		bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-@notification.inactivityDays.to_i.days}'")				
		workout=@user.workouts.where("trained_on < '#{Date.today}' && trained_on >= '#{Date.today-@notification.inactivityDays.to_i.days}'")
						
				
			if @notification.do_dont=="1"
					if bld.present? && workout.present? # if calorie loss amount mentioned achieved... email will be sent....
					allrecipient << email
					end
			else
					if !bld.present? && !workout.present?  # if calorie loss amount mentioned not achieved... email will be sent....
					allrecipient << email
					end			
			end


		end
				BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
			   rescheduleDates(notification) if @notification.frequency_type=="second"
		end
		end
	
	
		############################## consecutive 3 days no breakfast entered ########################
 
		def breakfastAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)

		if @notification.present? 	#check if admin has created lunch notification and turnOn the notification
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")


		bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-@notification.inactivityDays.to_i.days}'")
		breakfast=bld.where(:meal_type=>['7am','8am','9am','11am','10am'])
		
			if @notification.do_dont=="1"
					if breakfast.present? # if calorie loss amount mentioned achieved... email will be sent....
					allrecipient << email
					end
			else
					if !breakfast.present? # if calorie loss amount mentioned not achieved... email will be sent....
					allrecipient << email
					end			
			end

		end

				BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
			   rescheduleDates(notification) if @notification.frequency_type=="second"

		end	
		end
	 


		###################### consecutive 3 days no Lunch entered ################################

		def lunchAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)


		if @notification.present? 	#check if admin has created lunch notification and turnOn the notification
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		@userpermission=@user.mywwnotification.lunch							

		bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-@notification.inactivityDays.to_i.days}'" )
		lunch=bld.where(:meal_type=>['12pm','1pm','2pm','3pm','4pm','5pm','6pm'])						
			
			
			if @notification.do_dont=="1"
				if lunch.present? # if calorie loss amount mentioned achieved... email will be sent....
				allrecipient << email
				end
			else
				if !lunch.present? # if calorie loss amount mentioned not achieved... email will be sent....
				allrecipient << email
				end			
			end

		end
				BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
			   rescheduleDates(notification) if @notification.frequency_type=="second"

		end	
		end



		####################### consecutive 3 days no dinner entered ################################
 
		def dinnerAutoNotifications(id)
		notification=id
		@notification=Notification.find(notification)

		if @notification.present? 	#check if admin has created dinner notification and turnOn the notification
		@emails=@notification.notificationToId.split(",").collect{|a| a }
		allrecipient= []
		@emails.each do |email|
		@user=User.find_by_email("#{email}")
		@userpermission=@user.mywwnotification.dinner							

		bld=@user.meals.where("ate_on < '#{Date.today}' && ate_on >= '#{Date.today-@notification.inactivityDays.to_i.days}'")
		dinner=bld.where(:meal_type=>['1am','12am','11pm','10pm','9pm','8pm','7pm'])			
		
		
			if @notification.do_dont=="1"
				if dinner.present? # if calorie loss amount mentioned achieved... email will be sent....
				allrecipient << email
				end
			else
				if !dinner.present? # if calorie loss amount mentioned not achieved... email will be sent....
				allrecipient << email
				end			
			end

		end
				BusinessclaimMailer.usernotifications(@notification.message,allrecipient).deliver if allrecipient.present?		
			   rescheduleDates(notification) if @notification.frequency_type=="second"

		end	
		end



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
	      rescheduleDates(notification) if @notification.frequency_type=="second"
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
	   rescheduleDates(notification) if @notification.frequency_type=="second"	
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
		   rescheduleDates(notification) if @notification.frequency_type=="second"	
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
		   rescheduleDates(notification) if @notification.frequency_type=="second"
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
   rescheduleDates(notification) if @notification.frequency_type=="second"
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
	   rescheduleDates(notification) if @notification.frequency_type=="second"
#		end
#		end	

		end
		end

		##################################################################################

		def checknoti
		
	   end	
		
		
		
		
		
		####################################################################################
		
		def rescheduleDates(id)
			notificationid=id
			@notification=Notification.find(notificationid)

				scheduledDates=@notification.notificationFrequency.split(",").collect{|a| a.to_i }
				if scheduledDates.present?
				 scheduledDates.delete(scheduledDates.min)
				 dates=scheduledDates.collect{|a| a.to_s+".days"}.join(",")
				 if scheduledDates.length > 0
				 @notification.update_attributes(:notificationFrequency=>dates)
				 else        			
				 @notification.destroy 				
				 end 
				Notification.updateCronTab
			  end
		end
		
	 ######################################################################################			
	
		  def destroy
		 	@notification = Notification.find(params[:id])
		   @notification.destroy
		   Notification.updateCronTab 
	 	  end
  
	
		########################### mailer ###############################################
	
	
		
		def mailernotificaton(message, recepient)
		@message=message
		@recepient=recepient
		BusinessclaimMailer.usernotifications(@message,@recepient).deliver 
		end



end
