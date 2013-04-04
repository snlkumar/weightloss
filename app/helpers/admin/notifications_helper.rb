module Admin::NotificationsHelper

	def usersemails(email)
			allemail=email.split(",").collect{|a| a}
			allusersnames=[]
			allemail.each do |f|
			@user=User.find_by_email(f)
			allusersnames << @user.full_name 
			end
			allusersnames.collect{|a| a}.join(",").to_s
	end
end
