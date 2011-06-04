module FoodsHelper
  def food_name(food)
    if food.name
      if food.custom?
        "#{food.name} **"
      else
        food.name
      end
    else
      'Unknown'
    end
  end
  
  def serving_options(food)
    temp = [["", ""]]
    temp << [:gmwt_desc1, :gmwt_desc2].map do |attr| 
      if @food.send(attr).blank?
        nil
      else
        [truncate(@food.send(attr), :length => 25), @food.send(attr)]
      end
    end.compact.flatten
  end
end
