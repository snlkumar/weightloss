module TrackingsHelper
  def graph_selected?(graph_path)
    if graph_path == request.path
      'selected'
    else
      ''
    end
  end
  
  def greater_than_1_month?(range)
    ['2mth', '3mth', '6mth'].include?(range)
  end
  
  # TODO: delete (for testing)
  def test_date_range(range)
    range         = '1wk' if range.nil?
    temp          = Time.zone.today.beginning_of_day
    arr           = ["'#{ temp.strftime("%b %d") }'"]
    
    while temp > range_to_date_map( range )
      temp -= 1.day
      
      month_and_day = temp.strftime("%b %d")
      day           = temp.strftime("%d")
      
      if ['01'].include?( day )
        # show month/day on 1st/15th
        arr << "'#{ month_and_day}'"
      else
        if greater_than_1_month?( range )
          arr << "' '" # no day, too many ticks on graph
        else
          arr << "'#{ day }'"
        end
      end
      
    end
    arr.reverse
  end
  
  def date_range_selected?(range, selection)
    return 'selected' if (range.eql?('1wk') && selection == nil)
    
    if range == selection
      'selected'
    else
      ''
    end
  end
end
