module Forem
  module TopicsHelper
    def link_to_latest_post(post)
      return "" if post.nil?
      text = "#{time_ago_in_words(post.created_at)} ago by #{post.user}"
      link_to text, forum_topic_path(post.topic.forum, post.topic, :anchor => "post-#{post.id}")
    end

#  for devise login in forem post popup when user not logged in.

	def resource_name
    :user
  end
 
  def resource
    @resource ||= User.new
  end
 
  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end


  end
end
