module Forem
  class ForumsController < Forem::ApplicationController
    helper 'forem/topics'

    def index
      @forums = Forem::Forum.all
		@meta=Meta.where("controller= 'Forum' and  page='Forum List'").last
		if !@meta.blank?
		@meta_title=@meta.metatitle
		@meta_keywords=@meta.keywords
		@meta_description=@meta.description
		end

    end

    def show
      @forum = Forem::Forum.find(params[:id])
      @topics = @forum.topics.visible.by_pinned_or_most_recent_post.page(params[:page]).per(20)

		@meta=Meta.where("controller= 'Forum' and  page='Forum Topics'").last
		if !@meta.blank?
		@meta_title=@forum.title
		@meta_keywords=@meta.keywords
		@meta_description=@meta.description
		end
    end
  end
end
