class Notification < ActiveRecord::Base
  belongs_to :notificationable, :polymorphic => true


	def self.updateCronTab
			`rm -f '#{Rails.root}/config/schedule.rb' '#{Rails.root}/lib/tasks/sendnotifications.rake'`
					`rm -f '#{Rails.root}/config/schedule.rb' '#{Rails.root}/lib/tasks/sendnotifications.rake'`
				 envr = 'set :environment,"production"'
				 `echo '#{envr}' >> '#{Rails.root}/config/schedule.rb'`
				 auto_mail = Notification.all
				 if auto_mail
					i=0
							auto_mail.each do |a|
							
							 #	@cron_time="every "+a.notificationFrequency+", "+':at=>'+" "+'"'+a.time+'"'
							 	 a.notificationFrequency.split(",").each do |frequency|
							  	txt ="every "+frequency+" "+'do
								 rake "sendnotifications'+i.to_s+'"
							  end'
							  	task='task :sendnotifications'+i.to_s+' => :environment do
								 obj = NotificationsController.new
							 	 obj.'+a.notification_type+'AutoNotifications'+'('+a.id.to_s+')
							  end'
							  `echo '#{txt}' >> '#{Rails.root}/config/schedule.rb'`
							  `echo '#{task}' >> '#{Rails.root}/lib/tasks/sendnotifications.rake'`
							  i+=1
							 end
						 end
					`whenever -i`
			 end
	end	
  
end
