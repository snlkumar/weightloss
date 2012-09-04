class BodyfatGrapher < Grapher
  attr_accessor :ruby_data
  
  def initialize(range, user)
    @dates             = dates_for_graph(range)
    @bodyfats_for_dates = date_to_bodyfat_mapping(user.bodyfats.reverse)
    @ruby_data         = []
  end
  
  def js_data
    "[ #{ populate(@dates, @bodyfats_for_dates) } ]"
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
  
  def date_to_bodyfat_mapping(bodyfats)
    # creates a date to bodyfats mapping
    temp = {}
    bodyfats.each do |bodyfat|
      key       = bodyfat.created_at.strftime("%b %d %Y")
      temp[key] = bodyfat.bodyfat
    end
    temp
  end
end
