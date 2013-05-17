task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(1)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(7)
							  end
task :sendnotifications2 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(8)
							  end
