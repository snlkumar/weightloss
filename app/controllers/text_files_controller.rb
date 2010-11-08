class TextFilesController < ApplicationController
  # GET /text_files
  # GET /text_files.xml
  def index
    @text_files = TextFile.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @text_files }
    end
  end

  # GET /text_files/1
  # GET /text_files/1.xml
  def show
    @text_file = TextFile.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @text_file }
    end
  end

  # GET /text_files/new
  # GET /text_files/new.xml
  def new
    @text_file = TextFile.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @text_file }
    end
  end

  # GET /text_files/1/edit
  def edit
    @text_file = TextFile.find(params[:id])
  end

  # POST /text_files
  # POST /text_files.xml
  def create
    @text_file = TextFile.new(params[:text_file])

    respond_to do |format|
      if @text_file.save
        format.html { redirect_to(@text_file, :notice => 'TextFile was successfully created.') }
        format.xml  { render :xml => @text_file, :status => :created, :location => @text_file }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @text_file.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /text_files/1
  # PUT /text_files/1.xml
  def update
    @text_file = TextFile.find(params[:id])

    respond_to do |format|
      if @text_file.update_attributes(params[:text_file])
        format.html { redirect_to(@text_file, :notice => 'TextFile was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @text_file.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /text_files/1
  # DELETE /text_files/1.xml
  def destroy
    @text_file = TextFile.find(params[:id])
    @text_file.destroy

    respond_to do |format|
      format.html { redirect_to(text_files_url) }
      format.xml  { head :ok }
    end
  end
end
