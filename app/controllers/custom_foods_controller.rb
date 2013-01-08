class CustomFoodsController < ApplicationController
  layout 'tracking'
  
 	 before_filter :authenticate_user!
  
  def new
    if params[:name]
      @food = Food.new(:name=>params[:name],:custom => true)
    else
      @food = Food.new(:custom => true)
    end
  end

  def create
		session[:fd_name]=params[:food]["name"]
		@food = Food.new(params[:food])
    if @food.save
      redirect_to new_meal_path
    else
      render :action => 'new'
    end
  end
#new added method for update meal(servings)
def update_meal
    @food = Food.find(params[:id])
		@food.gmwt_desc1 = params[:food_name]
		@food.save!	
    render :text=>"food updated"
end

def edit
  @food=Food.find(params[:id])
end

def show
  params[:id]=((params[:id].gsub(/[$]+/, '.')).gsub(' or ',"/")).gsub(/["%"]+/,'%').gsub(/[-]+/,'"')
  @food=Food.find_by_name(params[:id])
  if @food.custom==false

			if params[:unit] && params[:unit]=="2"
				@multi=@food.gmwt_2/100
				@unit=@food.gmwt_desc2
		else
				@multi=@food.gmwt_1/100
				@unit=@food.gmwt_desc1
			end
		 else
		@multi=1
	end

#	weight_for=@food.gmwt_1
#  servingSize=@food.gmwt_desc1.gsub(/^\s+/,"").split(" ")[0].to_f
#@food.map {|key, value| puts "#{key} is #{value}" }
#render :json=>servingSize
#return

  if @food.nil?
    flash[:notice]=params[:id]+" food not exist."
  end
end
end
