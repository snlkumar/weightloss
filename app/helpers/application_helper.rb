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
