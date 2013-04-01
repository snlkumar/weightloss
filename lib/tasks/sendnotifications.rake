task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.caloriesAutoNotifications
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.bodyfatAutoNotifications
							  end
