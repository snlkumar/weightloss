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


end
