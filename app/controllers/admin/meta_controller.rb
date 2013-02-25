class Admin::MetaController < ApplicationController
  layout 'new_admin'
	def index
=begin	
	@meta=Meta.where('controller ="VideosLibrary"')
 	@meta.each do |meta|
 	meta.url="videos/"+meta.page.gsub(/[^0-9a-z’ ]/i, '').strip.gsub(/\s+/, "-")
 	meta.save	
 	end

	@meta=Meta.where('controller ="ArticlesLibrary"')
 	@meta.each do |meta|
 	meta.url="articles/"+meta.page.gsub(/[^0-9a-z’ ]/i, '').strip.gsub(/\s+/, "-")
 	meta.save	
 	end
 	
 	render :text=>"completed" 
=end 	
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
		
=begin	
	@videos=OldFlashFile.all
	@videos.each do |p|
	@meta=Meta.create(:url=>"videos/"+p.title, :metatitle=>p.title, :controller=>"VideosLibrary", :page=>p.title, :action=>"show")

	@meta.save
	end
	
	
##################	
	@videos=OldTextFile.all
	@videos.each do |p|
	@meta=Meta.create(:url=>"articles/"+p.page_title, :controller=>"ArticlesLibrary", :page=>p.page_title, :action=>"show", :metatitle=>p.page_title)
	@meta.save
	end	
	
=end	    	
    	
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
