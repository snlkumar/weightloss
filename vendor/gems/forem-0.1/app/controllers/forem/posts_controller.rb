module Forem
  class PostsController < Forem::ApplicationController
    before_filter :authenticate_forem_user
    before_filter :find_topic

    def new
      @post = @topic.posts.build
      if params[:quote]
        reply_to = @topic.posts.find(params[:reply_to_id])
        @post.text = "<blockquote>" + reply_to.text + "</blockquote>\n\n"
      end
    end

    def create
      if @topic.locked?
        flash[:error] = t("forem.post.not_created_topic_locked")
        redirect_to [@topic.forum, @topic] and return
      end
      
      @post      = @topic.posts.build(params[:post])
      @post.user = forem_user
      
      if @post.save
        PostReplyMailer.reply_notification(@topic,forem_user).deliver   #adding new parameter(forem_user) for send mail to current user
        
        flash[:notice] = t("forem.post.created")
        redirect_to [@topic.forum, @topic]
        
      else
        params[:reply_to_id] = params[:post][:reply_to_id]
        flash.now[:error] = t("forem.post.not_created")
        render :action => "new"
      end
    end
    
    def destroy
      @post = @topic.posts.find(params[:id])
      if forem_user.try(:id) == @post.user.try(:id)
        @post.destroy
        flash[:notice] = t("forem.post.deleted")
      else
        flash[:error] = t("forem.post.cannot_delete")
      end

      redirect_to [@topic.forum, @topic]
    end

    private

    def find_topic
      @topic = Forem::Topic.find(params[:topic_id])
    end
  end
end
