set :environment,"development"
every 2.4.hours do
								 rake "sendnotifications0"
							  end
every 2.4.hours do
								 rake "sendnotifications1"
							  end
every 24.0.hours do
								 rake "sendnotifications2"
							  end
