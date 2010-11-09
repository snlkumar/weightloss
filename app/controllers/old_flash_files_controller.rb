class OldFlashFilesController < ApplicationController
  layout 'old_application'
  
  # GET /flash_files
  # GET /flash_files.xml
  def index
    @flash_files = OldFlashFile.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @flash_files }
    end
  end

  # GET /flash_files/1
  # GET /flash_files/1.xml
  def show
    @flash_file = OldFlashFile.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @flash_file }
    end
  end

  # GET /flash_files/new
  # GET /flash_files/new.xml
  def new
    @flash_file = OldFlashFile.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @flash_file }
    end
  end

  # GET /flash_files/1/edit
  def edit
    @flash_file = OldFlashFile.find(params[:id])
  end

  # POST /flash_files
  # POST /flash_files.xml
  def create
    @flash_file = OldFlashFile.new(params[:old_flash_file])

    respond_to do |format|
      if @flash_file.save
        format.html { redirect_to(@flash_file, :notice => 'FlashFile was successfully created.') }
        format.xml  { render :xml => @flash_file, :status => :created, :location => @flash_file }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @flash_file.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /flash_files/1
  # PUT /flash_files/1.xml
  def update
    @flash_file = OldFlashFile.find(params[:id])

    respond_to do |format|
      if @flash_file.update_attributes(params[:old_flash_file])
        format.html { redirect_to(@flash_file, :notice => 'FlashFile was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @flash_file.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /flash_files/1
  # DELETE /flash_files/1.xml
  def destroy
    @flash_file = OldFlashFile.find(params[:id])
    @flash_file.destroy

    respond_to do |format|
      format.html { redirect_to(flash_files_url) }
      format.xml  { head :ok }
    end
  end
end
