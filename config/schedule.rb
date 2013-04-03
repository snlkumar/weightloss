set :environment,"development"
every 4.8.hours do
								 rake "sendnotifications0"
							  end
every 24.0.hours do
								 rake "sendnotifications1"
							  end
every 24.0.hours do
								 rake "sendnotifications2"
							  end
every 42.0.hours do
								 rake "sendnotifications3"
							  end
every 33.6.hours do
								 rake "sendnotifications4"
							  end
every 4.8.hours do
								 rake "sendnotifications5"
							  end
