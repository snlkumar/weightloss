task :sendGoalNotifications => :environment do
          obj = NotificationsController.new
          obj.goalAchieved
        end
        
        
task :checkBreakfast => :environment do
          #obj = NotificationsController.new
          #obj.breakfastNotifications1
          'mkdir /home/ravi/Desktop/ravi11'
        end
        
        
#task :checkLunch => :environment do
#          obj = NotificationsController.new
 #         obj.lunchNotifications
        end        
#                

#task :checkDinner => :environment do
#          obj = NotificationsController.new
#          obj.dinnerNotifications
 #       end                
