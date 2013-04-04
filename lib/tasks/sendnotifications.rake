task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(44)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(45)
							  end
task :sendnotifications2 => :environment do
								 obj = NotificationsController.new
							 	 obj.weightAutoNotifications(47)
							  end
