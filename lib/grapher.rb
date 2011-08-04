class Grapher
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
end