class NetCaloriesGrapher < Grapher
  attr_accessor :ruby_data
  
  def initialize(range, user)
    @user                        = user
    @dates                       = dates_for_graph(range)
    @calories_consumed_for_dates = calories_consumed_mapping
    @calories_burned_for_dates   = calories_burned_mapping
    @net_calories_for_dates      = net_calories_mapping
    @ruby_data                   = []
  end
  
  def js_consumed_data
    "[ #{ populate(@dates.clone, @calories_consumed_for_dates) } ]"
  end
  
  def js_burned_data
    "[ #{ populate(@dates.clone, @calories_burned_for_dates) } ]"
  end
  
  def js_net_data
    "[ #{ populate(@dates.clone, @net_calories_for_dates) } ]"
  end
  
  # TODO: now that the graph is a datetime graph we don't need to worry about populating every date
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
  
  def calories_consumed_mapping
    # creates a date to calorie consumed mapping
    temp = {}
    @dates.each {|day| temp[ day.strftime("%b %d %Y") ] = @user.total_calories_consumed_on(day) }
    temp
  end
  
  def calories_burned_mapping
    # creates a date to calorie burned mapping
    temp = {}
    @dates.each {|day| temp[ day.strftime("%b %d %Y") ] = @user.total_calories_burned_on(day) }
    temp
  end
  
  def net_calories_mapping
    # creates a date to net calories mapping
    temp = {}
    @dates.each {|day| temp[ day.strftime("%b %d %Y") ] = @user.net_calories_on(day) }
    temp
  end
end