class Admin::MetaController < ApplicationController
  layout 'new_admin'
	def index
	end

	def meta
		@meta=meta.new
	end


	def create
	@meta=Meta.create(params[:meta])

   if @meta.save
     		redirect_to(admin_meta_path, :notice => 'meta created.')
     	else
			@notice = 'meta not created.'
    	end
	end

 def show
 	@meta=Meta.find(params[:id])
 	respond_to do |format|
 		format.html
  		format.js  { render :json => @meta }
 	end
  end



  def destroy
    @meta=Meta.find(params[:id])
  	 @meta.destroy
	 redirect_to(admin_meta_path, :notice => 'successfully deleted.')
	end


	def edit
    @meta=Meta.find(params[:id])

	end


 	def update
 	@meta=Meta.find(params[:id])   
	respond_to do |format|
		   if @meta.update_attributes(:keywords=>params[:keywords], :metatitle=>params[:metatitle], :description=>params[:description], :url=>params[:url])
		     format.html { render :json => "Successfully saved." }		   
		     format.js  { render :json => "Successfully saved." }
		   else
		     format.html  { render :json => @meta.errors.full_messages.first }		   		   
		     format.js  { render :json =>  @meta.errors.full_messages.first }
		   end
		end
	 end

end
