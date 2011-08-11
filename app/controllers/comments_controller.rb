class CommentsController < ApplicationController
  
  def create
    @comment = params[:class_name].classify.constantize.find(params[:id])
    @comment.comments.create(params[:comment])
    redirect_to :back
  end
end
