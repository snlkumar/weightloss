task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.weightAutoNotifications
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.caloriesAutoNotifications
							  end
task :sendnotifications2 => :environment do
								 obj = NotificationsController.new
							 	 obj.bodyfatAutoNotifications
							  end
task :sendnotifications3 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications
							  end
