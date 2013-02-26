set :environment,"development"

#every :day, :at => "5 pm" do
# rake "sendGoalNotifications"
#end

#every 2.minutes do
#command "mkdir /home/ravi/ravi11"
 #rake "checkBreakfast"
#end

#every :day, :at => "9 pm" do
# rake "checkLunch"
#end

#every :day, :at => "11 pm" do
# rake "checkDinner"
#end



every :day, :at => "9 pm" do
 rake "sendnotifications2"
 #command "mkdir /home/ravi/Desktop/ravi111"
end



#every 50.minutes do
# rake "sendnotifications3"
 #command "mkdir /home/ravi/Desktop/ravi111"
#end
