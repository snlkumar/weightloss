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
end
