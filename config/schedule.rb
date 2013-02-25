set :environment,"development"

#every :day, :at => "5 pm" do
# rake "sendGoalNotifications"
#end

every 2.minutes do
 rake "checkBreakfast"
end

#every :day, :at => "9 pm" do
# rake "checkLunch"
#end

#every :day, :at => "11 pm" do
# rake "checkDinner"
#end
