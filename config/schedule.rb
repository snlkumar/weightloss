set :environment,"development"
every 1.day, :at=> "6:00 am" do
								 rake "sendnotifications0"
							  end
every 1.day, :at=> "6:00 am" do
								 rake "sendnotifications1"
							  end
every 1.day, :at=> "6:00 am" do
								 rake "sendnotifications2"
							  end
every 1.day, :at=> "6:00 am" do
								 rake "sendnotifications3"
							  end
