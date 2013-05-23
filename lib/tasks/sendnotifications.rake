task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(10)
							  end
