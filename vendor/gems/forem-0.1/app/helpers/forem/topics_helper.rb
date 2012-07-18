module Forem
  module TopicsHelper
    def link_to_latest_post(post)
      return "" if post.nil?
      text = "#{time_ago_in_words(post.created_at)} ago by #{post.user}"
      link_to text, forum_topic_path(post.topic.forum, post.topic, :anchor => "post-#{post.id}")
    end
  end
end
