task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(1)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(2)
							  end
task :sendnotifications2 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(3)
							  end
task :sendnotifications3 => :environment do
								 obj = NotificationsController.new
							 	 obj.activityAutoNotifications(4)
							  end
