class PhotosController < ApplicationController
  def index
    #@photo=Photo.all
  end    

  def new
    @photo=Photo.new
  end  

	def create
		@user=current_user
		@photo=@user.photos.create(params[:photo])
		if @photo.save
     		redirect_to(photo_path(@user.id), :notice => 'photo created.')
     	else
			@notice = 'photo not upload.'
    	end
   end

  #end create
  
  def update
  @photo= Photo.find(params[:id])

    respond_to do |format|
      if @photo.update_attributes(params[:photo])
        format.html { redirect_to(photos_path, :notice => 'photo was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @photo.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def edit
    @photo=Photo.find(params[:id])
  end
	
	def show
		if current_user
			@user_id=current_user.id
		else
			@user_id=params[:id]
		end

		@photo= Photo.where(:user_id=>params[:id])
      @photo1=Photo.new
		if @photo==nil
    		flash[:notice] = "User has no photos in gallery"
		end
	end
	
	def filterPhotosByBeforeAfter
		if current_user
			@user_id=current_user.id
		else
			@user_id=params[:id]
		end

		@photo= Photo.where("user_id=? and before_after=?",params[:id],params[:filterPhotosByBeforeAfter])
      @photo1=Photo.new
		if @photo==nil
    		flash[:notice] = "User has no photos"
		end
		render :template => 'photos/show'
	end

  def destroy
    @photo=Photo.find(params[:id])
     @photo.destroy
if @photo.destroy
        redirect_to(photos_index_path, :notice => 'photo deleted.')
  end
end 

end 

