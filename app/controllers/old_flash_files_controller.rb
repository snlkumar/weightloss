class OldFlashFilesController < ApplicationController
  layout 'old_application'
  
  def index
    @flash_files = OldFlashFile.all
  end
  
  def show
    @flash_file = OldFlashFile.find(params[:id])
    @flash_file.update_attribute(:view_count, @flash_file.view_count + 1)
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
      	@meta=Meta.create(:url=>"videos/"+@flash_file.gsub(/[^0-9a-z’_ ]/i, '').strip.gsub(/\s+/, "-"), :metatitle=>@flash_file.title, :controller=>"VideosLibrary", :page=>@flash_file.title, :action=>"show")
    else
      render :action => "new"
    end
  end
  
  def update
    @flash_file = OldFlashFile.find(params[:id])
    @meta=Meta.find_by_controller_and_page('VideosLibrary',"#{@flash_file.title}")
    if @flash_file.update_attributes(params[:old_flash_file])
         @meta.update_attributes(:page=>params[:old_flash_file][:title],:metatitle=>params[:old_flash_file][:title])  
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
