task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(26)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(27)
							  end
task :sendnotifications2 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(28)
							  end
