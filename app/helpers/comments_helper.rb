module CommentsHelper
  def comment_post_date(comment)
    "#{ comment.created_at.strftime("%B %d, %Y") } at #{ comment.created_at.strftime("%I:%M %p").downcase }"
  end
end
