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
     		redirect_to(photo_path(@user.cached_slug), :notice => 'photo created.')
     	else
			@notice = 'photo not upload.'
    	end
   end

  #end create
	
	def show
	   @user = User.find(params[:id])
	   @user_id=@user.id	 
		@photo= @user.photos.all
      @photo1=Photo.new
		if @photo==nil
    		flash[:notice] = "User has no photos in gallery"
		end
	end
	
	def filterPhotosByBeforeAfter
	   @user = User.find(params[:id])	
		@user_id=@user.id
		@photo= Photo.where("user_id=? and before_after=?",@user_id,params[:filterPhotosByBeforeAfter])
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

