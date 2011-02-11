class FoodsController < ApplicationController
  def search
    @foods = Food.find(:all, :conditions => ["shrt_desc LIKE ?", "%#{params[:term]}%"])
    
    render :json => @foods.map{|f| {:value => f.shrt_desc, :id => f.id} }.to_json
  end

end
