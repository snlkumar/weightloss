class CustomFoodsController < ApplicationController
  layout 'tracking'
  
 	 before_filter :authenticate_user!, :except => [:show, :index, :searchFood]
  
  def new
    if params[:name]
      @food = Food.new(:name=>params[:name],:custom => true)
    else
      @food = Food.new(:custom => true)
    end
  end

#################################################
  def create
		session[:fd_name]=params[:food]["name"]
		@food = Food.new(params[:food])
    if @food.save
      redirect_to new_meal_path
    else
      render :action => 'new'
    end
  end
  
####################################################

	def edit
	  @food=Food.find(params[:id])
	end




####################################################  



#new added method for update meal(servings)
	def update_meal
		 @food = Food.find(params[:id])
			@food.gmwt_desc1 = params[:food_name]
			@food.save!	
		 render :text=>"food updated"
	end



##############################################################

	def show
	#  params[:id]=((params[:id].gsub(/[$]+/, '.')).gsub(' or ',"/")).gsub(/["%"]+/,'%').gsub(/[-]+/,'"')
	  @food=Food.find(params[:id])
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
  
  
	if current_user
		  render :layout=>'tracking'
		else
		  render :layout=>'custom_food_public'
	end

                        #@meta=Meta.where("controller= 'Food' and  page='Food List'").last
                                #if !@meta.blank?
                                @meta_title=@food.name
                                @meta_keywords=@food.name
                                @meta_description=@food.name
                        #end
	
	
end
###############################################################################


	def index 	
	@foods=Food.with_a_serving_size.page(params[:page] || 1).per(50).order('name ASC')
		if current_user
		  	 render :layout=>'tracking'
			else
	  		 render :layout=>'custom_food_public'
		end
		
                        #@meta=Meta.where("controller= 'Food' and  page='Food List'").last
                                #if !@meta.blank?
                                @meta_title="Food List"
                                @meta_keywords="Food list"
                                @meta_description="Food list"
                        #end
	
	end
	
#################################################################	


	def searchFood	
    terms  = params[:terms].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "name LIKE ?"}.join(' AND ')
    @foods1 = Food.with_a_serving_size.find(:all, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    @foods = Kaminari.paginate_array(@foods1).page(params[:page]).per(25)	
		if current_user
    		 render 'index', :layout=>'tracking'       
	  		else
	  		 render 'index', :layout=>'custom_food_public'
		end    

	end

###########################################################################
end
