class VideosController < ApplicationController
  layout 'search'
  
  before_filter :require_user
  before_filter :get_categories, :only => :show
  
  def show
    @video = OldFlashFile.find(params[:id])
  end

end
