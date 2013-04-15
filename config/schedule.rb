set :environment,"production"
every 22.days do
								 rake "sendnotifications0"
							  end
every 13.days do
								 rake "sendnotifications1"
							  end
every 14.days do
								 rake "sendnotifications2"
							  end
every 15.days do
								 rake "sendnotifications3"
							  end
every 3.43.hours do
								 rake "sendnotifications4"
							  end
