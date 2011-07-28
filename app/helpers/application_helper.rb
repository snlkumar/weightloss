# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def settings_page?(page)
    case page
    when 'account'
      request.request_uri.eql? user_edit_account_info_path(current_user)
    when 'personal'
      request.request_uri.eql? user_edit_personal_info_path(current_user)
    when 'nutrition'
      request.request_uri.eql? user_edit_nutrition_info_path(current_user)
    when 'exercise'
      request.request_uri.eql? user_edit_exercise_info_path(current_user)
    else
      false
    end
  end
  
  def active_settings_tab?(page)
    settings_page?(page) ? 'active' : ''
  end
  
  def pagination_params(request)
    request.params.reject{|key, val| ['authenticity_token', 'commit'].include?(key.to_s) }
  end
  
  def in_admin?
    request.path.match(/admin/)
  end
  
  def range_to_date_map(range)
    case range
    when '1wk'
      1.week.ago
    when '2wk'
      2.weeks.ago
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
  
  def greater_than_1_month?(range)
    ['2mth', '3mth', '6mth'].include?(range)
  end
  
  def test_date_range(range)
    range         = '1wk' if range.nil?
    temp          = Time.zone.today.beginning_of_day
    arr           = ["'#{ temp.strftime("%b %d") }'"]
    
    while temp > range_to_date_map( range )
      temp -= 1.day
      
      month_and_day = temp.strftime("%b %d")
      day           = temp.strftime("%d")
      
      if ['01', '15'].include?( day )
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
  
  def clippy(text, bgcolor='#FFFFFF')
    html = <<-EOF
      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
              width="110"
              height="14"
              id="clippy" >
      <param name="movie" value="/flash/clippy.swf"/>
      <param name="allowScriptAccess" value="always" />
      <param name="quality" value="high" />
      <param name="scale" value="noscale" />
      <param NAME="FlashVars" value="text=#{text}">
      <param name="bgcolor" value="#{bgcolor}">
      <embed src="/flash/clippy.swf"
             width="110"
             height="14"
             name="clippy"
             quality="high"
             allowScriptAccess="always"
             type="application/x-shockwave-flash"
             pluginspage="http://www.macromedia.com/go/getflashplayer"
             FlashVars="text=#{text}"
             bgcolor="#{bgcolor}"
      />
      </object>
    EOF
  end
end
