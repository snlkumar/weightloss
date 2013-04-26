set :environment,"production"
every 24.0.hours do
								 rake "sendnotifications0"
							  end
every 24.0.hours do
								 rake "sendnotifications1"
							  end
every 24.0.hours do
								 rake "sendnotifications2"
							  end
every 24.0.hours do
								 rake "sendnotifications3"
							  end
