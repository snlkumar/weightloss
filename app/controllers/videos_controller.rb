class VideosController < ApplicationController
  layout 'search'
  
  before_filter :authenticate_user!
  before_filter :get_categories, :only => :show
  
  def show
    @video = OldFlashFile.find(params[:id])
  end

end
