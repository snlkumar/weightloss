task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(7)
							  end
