class OldSuccessStoriesController < ApplicationController
  layout 'old_application'
  
  # GET /success_stories
  # GET /success_stories.xml
  def index
    @success_stories = OldSuccessStory.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @success_stories }
    end
  end

  # GET /success_stories/1
  # GET /success_stories/1.xml
  def show
    @success_story = OldSuccessStory.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @success_story }
    end
  end

  # GET /success_stories/new
  # GET /success_stories/new.xml
  def new
    @success_story = OldSuccessStory.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @success_story }
    end
  end

  # GET /success_stories/1/edit
  def edit
    @success_story = OldSuccessStory.find(params[:id])
  end

  # POST /success_stories
  # POST /success_stories.xml
  def create
    @success_story = OldSuccessStory.new(params[:old_ success_story])

    respond_to do |format|
      if @success_story.save
        format.html { redirect_to(@success_story, :notice => 'SuccessStory was successfully created.') }
        format.xml  { render :xml => @success_story, :status => :created, :location => @success_story }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @success_story.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /success_stories/1
  # PUT /success_stories/1.xml
  def update
    @success_story = OldSuccessStory.find(params[:id])

    respond_to do |format|
      if @success_story.update_attributes(params[:old_ success_story])
        format.html { redirect_to(@success_story, :notice => 'SuccessStory was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @success_story.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /success_stories/1
  # DELETE /success_stories/1.xml
  def destroy
    @success_story = OldSuccessStory.find(params[:id])
    @success_story.destroy

    respond_to do |format|
      format.html { redirect_to(success_stories_url) }
      format.xml  { head :ok }
    end
  end
end
