class WeightGrapher < Grapher
  attr_accessor :ruby_data
  
  def initialize(range, user)
    @dates             = dates_for_graph(range)
    @weights_for_dates = date_to_weight_mapping(user.weights.reverse)
    @ruby_data         = []
  end
  
  def js_data
    "[ #{ populate(@dates, @weights_for_dates) } ]"
  end
  
  def populate(blanks, fills)
    blanks.each_with_index do |day, index|
      if fills[day.strftime("%b %d %Y")]
        blanks[index] = "[ #{day.to_i * 1000}, #{fills[day.strftime("%b %d %Y")]}]"
        @ruby_data << [day.to_i * 1000, fills[day.strftime("%b %d %Y")]]
      else
        blanks[index] = nil
      end
    end
    blanks.compact.join(', ')
  end
  
  def date_to_weight_mapping(weights)
    # creates a date to weight mapping
    temp = {}
    weights.each do |weight|
      key       = weight.created_at.strftime("%b %d %Y")
      temp[key] = weight.weight
    end
    temp
  end
end