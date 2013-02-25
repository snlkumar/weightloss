class Notification < ActiveRecord::Base
  belongs_to :notificationable, :polymorphic => true
end
