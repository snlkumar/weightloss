	class FoodsController < ApplicationController
   before_filter :authenticate_user!

  
  def search
    terms  = params[:term].split(/,|\s/).reject(&:blank?)
    conds  = terms.collect{|t| "shrt_desc LIKE ?"}.join(' AND ')
    @foods = Food.with_a_serving_size.find(:all, :limit=>20, :conditions => [conds, *terms.collect{|t| "%#{t}%"}])
    
    if @foods.empty?
      render :json => [{:value => 'No Results', :id => nil}].to_json
    else
			#@newjson=@foods.map{|f| {:value => (f.custom? ? "#{f.name} **" : "#{f.name}-#{f.gmwt_desc1}-#{f.energ_kcal}-#{f.total_fat}-#{f.carbohydrt}-#{f.protein}-#{f.fiber_td}"), :id => f.id} }.to_json

#puts @newjson
      #render :json => @foods.map{|f| {:value => (f.custom? ? "#{f.name} **" : f.name), :id => f.id} }.to_json
      #old code
			#render :json => @foods.map{|f| {:value => (f.custom? ? "#{f.name} **" : "#{f.name} - #{f.gmwt_desc1} - #{f.energ_kcal} - #{f.total_fat} - #{f.carbohydrt} - #{f.protein} - #{f.fiber_td}"), :id => f.id} }.to_json
			
			render :json => @foods.map{|f| {:value => ("#{f.name} ** #{f.gmwt_desc1} ** #{ eq_calories(f.id, "calorie")} ** #{eq_calories(f.id, "fat")} ** #{ eq_calories(f.id, "carbohydrt")} ** #{eq_calories(f.id, "protein")} ** #{eq_calories(f.id, "fiber_td")}"), :id => f.id} }.to_json
    end
    
  end




####################################################################################


	def food_servings	
		if params[:id]	
			@servings=Food.where(:id => params[:id]).select("gmwt_1, gmwt_desc1,gmwt_2, gmwt_desc2")

			if @servings.empty?
      		render :json => 'No Results'.to_json
    		else
				render :json => @servings.map{|f| {:value => ("#{f.gmwt_1} $$#{f.gmwt_desc1}$$ #{f.gmwt_2} $$#{f.gmwt_desc2}"), :id => params[:id]} }.to_json	
			end
		end
	end
####################################################################################################

  def meal_item_calories
    meal_item = MealItem.new(params[:meal][:meal_items_attributes].first.last)
    meal_item.determine_quantity
    meal_item.calculate_calories
    render :json => {:calories => meal_item.calories}
  end
  
  
  
#################################################################################################


	  def eq_calories(fid, type)

			@food=Food.find(fid)
			serving=@food.gmwt_desc1.gsub(/^\s+/,"").split(" ")[0].to_f;
			#weight_for_quantity = @food.units.blank?  ? 0 : (!food.gmwt_desc1.nil? ? @food.gmwt_1 : (@food.gmwt_2.blank?  ? "

			 if !@food.custom

					 case type
						 when 'calorie'
								calories       = (@food.energ_kcal.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 
						 when 'fat'
									calories       = (@food.lipid_tot.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 
						 when 'carbohydrt'
								calories       = (@food.carbohydrt.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 
						 when 'protein'
								calories       = (@food.protein.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 
						 when 'fiber_td'
								calories       = (@food.fiber_td.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 

						 end


						#calories       = (@food.energ_kcal.to_f * (@food.gmwt_1.to_f * serving.to_f) / 100) 
			else
				#servingSize1=@food.gmwt_desc1.gsub(/^\s+/,"").split(" ")[0].to_f 
				#calories=@food.energ_kcal

					 case type
						 when 'calorie'
								calories       = @food.energ_kcal
						 when 'fat'
									calories    = @food.total_fat
						 when 'carbohydrt'
								calories       = @food.carbohydrt
						 when 'protein'
								calories       = @food.protein
						 when 'fiber_td'
								calories       = @food.fiber_td

						 end

			end
			return calories.round(2) unless calories.nil? 

      end
      
#############################################################################################################        
end
#protein
