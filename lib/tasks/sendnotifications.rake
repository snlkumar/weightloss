task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.foodAutoNotifications(19)
							  end
task :sendnotifications1 => :environment do
								 obj = NotificationsController.new
							 	 obj.food_typeAutoNotifications(20)
							  end
