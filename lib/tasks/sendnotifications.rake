task :sendnotifications0 => :environment do
								 obj = NotificationsController.new
							 	 obj.proteinAutoNotifications(29)
							  end
