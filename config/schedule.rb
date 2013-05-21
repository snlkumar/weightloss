set :environment,"production"
every 24.0.hours do
								 rake "sendnotifications0"
							  end
