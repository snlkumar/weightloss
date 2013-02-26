task :sendnotifications2 => :environment do
          obj = NotificationsController.new
          obj.sendmailsToUsers
        end
        
#task :sendnotifications3 => :environment do
#          obj = NotificationsController.new
 #         obj.sendmailsToUsers1
 #       end      
        
        
#task :checkLunch => :environment do
#          obj = NotificationsController.new
 #         obj.lunchNotifications
#        end        
#                

#task :checkDinner => :environment do
#          obj = NotificationsController.new
#          obj.dinnerNotifications
 #       end                
