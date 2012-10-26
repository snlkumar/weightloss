class VideosController < ApplicationController
  layout 'public_content'
  
  before_filter :get_categories
  
  def index
			@meta=Meta.where("controller='Video Library' and  page='Videos List'").last
			if !@meta.blank?
			@meta_title=@meta.metatitle
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end
	
    @latest     = OldFlashFile.order("created_at DESC").limit(2)
    @medicals   = OldFlashFile.where(:category_id => Category.find_by_name('Medical').id).order("created_at DESC").limit(2)
    @exercises  = OldFlashFile.where(:category_id => Category.find_by_name('Exercise').id).order("created_at DESC").limit(2)
    @recipes    = OldFlashFile.where(:category_id => Category.find_by_name('Recipes').id).order("created_at DESC").limit(2)
    @nutritions = OldFlashFile.where(:category_id => Category.find_by_name('Nutrition').id).order("created_at DESC").limit(2)

  end
  
  def show
			@meta=Meta.where("controller='Video Library' and  page='View Video'").last
			if !@meta.blank?
			@meta_title=@meta.metatitle
			@meta_keywords=@meta.keywords
			@meta_description=@meta.description
			end

    @video = OldFlashFile.find(params[:id])
#    @video = OldFlashFile.find(:all)
  end
  
end
