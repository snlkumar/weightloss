class OldFlashFilesController < ApplicationController
  layout 'old_application'
  
  def index
    @flash_files = OldFlashFile.all
  end
  
  def show
    @flash_file = OldFlashFile.find(params[:id])
  end
  
  def new
    @flash_file = OldFlashFile.new
  end
  
  def edit
    @flash_file = OldFlashFile.find(params[:id])
  end
  
  def create
    @flash_file = OldFlashFile.new(params[:old_flash_file])
    
    if @flash_file.save
      redirect_to(old_flash_files_url, :notice => 'FlashFile was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @flash_file = OldFlashFile.find(params[:id])
    
    if @flash_file.update_attributes(params[:old_flash_file])
      redirect_to(old_flash_files_url, :notice => 'FlashFile was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @flash_file = OldFlashFile.find(params[:id])
    @flash_file.destroy

    redirect_to(old_flash_files_url)
  end
end
