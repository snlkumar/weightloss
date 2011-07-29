class WeightGrapher
  attr_accessor :ruby_data
  
  def initialize(range, user)
    @dates             = dates_for_graph(range)
    @weights_for_dates = date_to_weight_mapping(user.weights.reverse)
    @ruby_data = []
  end
  
  def js_data
    "[ #{ populate(@dates, @weights_for_dates) } ]"
  end
  
  def range_to_date_map(range)
    case range
    when '1wk'
      1.week.ago
    when '2wk'
      2.weeks.ago
    when '3wk'
      3.weeks.ago
    when '1mth'
      1.month.ago
    when '2mth'
      2.months.ago
    when '3mth'
      3.months.ago
    when '6mth'
      6.months.ago
    end
  end
  
  def dates_for_graph(range)
    range = '1wk' if range.nil?
    temp  = Time.zone.today.beginning_of_day
    arr   = [ temp ]
    
    while temp > range_to_date_map( range )
      temp -= 1.day
      
      arr << temp
    end
    arr.reverse
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