set :environment,"development"
every 7.days, :at=> "6:00 am" do
								 rake "sendnotifications0"
							  end
every 2.days, :at=> "6:00 am" do
								 rake "sendnotifications1"
							  end
every 1.day, :at=> "6:00 am" do
								 rake "sendnotifications2"
							  end
every 2.days, :at=> "6:00 am" do
								 rake "sendnotifications3"
							  end
every 3.days, :at=> "6:00 am" do
								 rake "sendnotifications4"
							  end
