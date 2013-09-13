task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.weightAutoNotifications(1)
							  end
