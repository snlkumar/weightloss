module Forem
  class Forum < ActiveRecord::Base
    has_many :topics, :dependent => :destroy
    has_many :posts, :through => :topics, :dependent => :destroy
    has_many :views, :through => :topics, :dependent => :destroy

    validates :title, :presence => true
    validates :description, :presence => true

	def to_param
	  "#{id}-#{title}".downcase.gsub(/\W+/, "-").gsub(/^[-]+|[-]$/,"").strip
	end

    def last_post
      posts.last
    end
  end
end
