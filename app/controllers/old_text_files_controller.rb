class OldTextFilesController < ApplicationController
  layout 'old_application'
  
  # GET /text_files
  # GET /text_files.xml
  def index
    @text_files = OldTextFile.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @text_files }
    end
  end

  # GET /text_files/1
  # GET /text_files/1.xml
  def show
    @text_file = OldTextFile.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @text_file }
    end
  end

  # GET /text_files/new
  # GET /text_files/new.xml
  def new
    @text_file = OldTextFile.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @text_file }
    end
  end

  # GET /text_files/1/edit
  def edit
    @text_file = OldTextFile.find(params[:id])
  end

  # POST /text_files
  # POST /text_files.xml
  def create
    @text_file = OldTextFile.new(params[:old_text_file])

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
    @text_file = OldTextFile.find(params[:id])

    respond_to do |format|
      if @text_file.update_attributes(params[:old_text_file])
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
    @text_file = OldTextFile.find(params[:id])
    @text_file.destroy

    respond_to do |format|
      format.html { redirect_to(text_files_url) }
      format.xml  { head :ok }
    end
  end
end
