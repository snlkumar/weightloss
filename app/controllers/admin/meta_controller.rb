class Admin::MetaController < ApplicationController
  layout 'new_admin'
	def index
	@meta=Meta.all
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
		   if @meta.update_attributes(params[:meta])
		     format.html {redirect_to((admin_meta_path), :notice => 'Successfully updated.')}
		   else
				format.html { render :action => "edit"}
		   end
		end
	 end

end
