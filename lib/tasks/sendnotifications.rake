task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(10)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(11)
							  end
