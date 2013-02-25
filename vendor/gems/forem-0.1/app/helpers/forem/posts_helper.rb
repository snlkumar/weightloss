module Forem
  module PostsHelper
    def avatar(user, options = {})
      # if (email = user.try(:email)).present?
      #         image_tag(avatar_url(email, options), :alt => "Gravatar")
      #       end
      user_avatar_image user, :tracking
    end

    def avatar_url(email, options = {})
      options = {:size => 60}
      require 'digest/md5'
      size = ("?s=#{options[:size]}" if options[:size])
      "http://gravatar.com/avatar/#{Digest::MD5.hexdigest(email.to_s.strip.downcase)}#{size}.jpg"
    end
  end
end
