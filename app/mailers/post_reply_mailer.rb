class PostReplyMailer < ActionMailer::Base
  default :from => "no-reply@myweightworld.com"

=begin  
  def reply_notification(topic)
    
    @topic = topic
    @users = Forem::Topic.first.posts.map{|p| p.user }.uniq
    @users.each do |user|
    @user = user
    mail(:to =>@user.email, :subject => 'Forum reply on MyWeightWorld')
    end
  end
=end
  #new added logic for sending mail
  def reply_notification(topic,user)
    @topic = topic
    @user = user    
    mail(:to =>@user.email, :subject => 'Forum reply on MyWeightWorld')
  end
  
end
