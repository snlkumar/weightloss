class NotificationsController < ApplicationController



	def sendmailsToUsers
		@users=User.find(:all)
		@notification="Contratulations, you achieved your desired weight goal !!!"
			@users.each do |user|		
				if user.desired_weight >= user.weight
				BusinessclaimMailer.usernotifications(@notification,user).deliver 
				end
	 		end
	end


	def sendmailsToUsers1
	@user=User.find(:all)
	@notification="Contratulations, you achieved your desired weight goal !!!"
	#@users.each do |user|		
		#if user.desired_weight >= user.weight
		BusinessclaimMailer.usernotifications(@notification,@user).deliver 
		#end
	 #end     	
	end








	def goalAchieved
	@users=User.all
	@users.each do |user|		
		if user.desired_weight >= user.weight
				notificaion="Congratulations, you have achieved your weight goal !!!"
				BusinessclaimMailer.usernotifications(notification,user).deliver 
				end	
	   end     	
	end



	def breakfatNotifications1
	@users=User.find(:all)
	   @users.each do |user|
				if user.mywwnotificaion.breakfast				
				@breakfast=@user.meal.where("meal_type='Breakfast' and ate_on='Time.today'")
					if @breakfast.nil?
					notificaion="Breakfast is the most important meal of the day !!!"
					BusinessclaimMailer.usernotifications(notification,user).deliver
					end 
			end
		end
	     	
	end


	def breakfatNotifications
	@users=User.all
	@users.each do |user|				
		@breakfast=user.meal.where("meal_type='Breakfast' and ate_on='Time.today'")
		if @breakfast.nil?
		notificaion="Breakfast is the most important meal of the day !!!"
		BusinessclaimMailer.usernotifications(notification,user).deliver 
		end
	
	   end     	
	end


	def lunchNotifications
	@users=User.all
	@users.each do |user|		

		@breakfast=user.meal.where("meal_type=>'Breakfast' and ate_on='Time.today'")
		if @breakfast.nil?
		notificaion="Congratulations, you have achieved your weight goal !!!"
		BusinessclaimMailer.usernotifications(notification,user).deliver 
		end
		
		
	   end     	
	end


	def dinnerNotifications
	@users=User.all
	@users.each do |user|		
		
		@breakfast=user.meal.where("meal_type=>'Breakfast' and ate_on='Time.today'")
		if @breakfast.nil?
		notificaion="Congratulations, you have achieved your weight goal !!!"
		BusinessclaimMailer.usernotifications(notification,user).deliver 
		end		
		
	   end     	
	end



	def new
		@notification=Notification.new
	end	


	def create
	@notification=Notification.create(params[:notification])
	end

	def stopnotifications
			if params[:stopnotification]
			@user=User.find(:id)
			@user.update_attributes(:stopMywwNotifications=>true)
			render :text=>"done"
			end	
		
	end

end
