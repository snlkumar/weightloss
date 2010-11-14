class OldSuccessStoriesController < ApplicationController
  layout 'old_application'
  
  def index
    @success_stories = OldSuccessStory.all
  end
  
  def show
    @success_story = OldSuccessStory.find(params[:id])
  end
  
  def new
    @success_story = OldSuccessStory.new
  end
  
  def edit
    @success_story = OldSuccessStory.find(params[:id])
  end
  
  def create
    @success_story = OldSuccessStory.new(params[:old_success_story])
    
    if @success_story.save
      redirect_to(old_success_stories_url, :notice => 'Success Story was successfully created.')
    else
      render :action => "new" 
    end
  end
  
  def update
    @success_story = OldSuccessStory.find(params[:id])
    
    if @success_story.update_attributes(params[:old_success_story])
      redirect_to(old_success_stories_url, :notice => 'Success Story was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @success_story = OldSuccessStory.find(params[:id])
    @success_story.destroy
    
    redirect_to(old_success_stories_url)
  end
end
