class FoodsController < ApplicationController
  before_filter :require_user
  
  def search
    terms  = params[:term].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "shrt_desc LIKE ?"}.join(' AND ')
    @foods = Food.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
    render :json => @foods.map{|f| {:value => f.shrt_desc, :id => f.id} }.to_json
  end

end
