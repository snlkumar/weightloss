class OldTextFilesController < ApplicationController
  layout 'old_application'
  
  def index
    @text_files = OldTextFile.all
  end
  
  def show
    @text_file = OldTextFile.find(params[:id])
    @text_file.update_attribute(:view_count, @text_file.view_count + 1)
  end
  
  def new
    @text_file = OldTextFile.new
  end
  
  def edit
    @text_file = OldTextFile.find(params[:id])
  end
  
  def create
    @text_file = OldTextFile.new(params[:old_text_file])
    
    if @text_file.save
      redirect_to(old_text_files_url, :notice => 'TextFile was successfully created.')
    else
      render :action => "new"
    end
  end
  
  def update
    @text_file = OldTextFile.find(params[:id])

    if @text_file.update_attributes(params[:old_text_file])
      redirect_to(old_text_files_url, :notice => 'TextFile was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @text_file = OldTextFile.find(params[:id])
    @text_file.destroy
    
    redirect_to(old_text_files_url)
  end
end
