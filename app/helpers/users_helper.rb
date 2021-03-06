module UsersHelper
  def user_mini_info(user)
    [@user.employment_position, @user.marital_status.try(:titleize), @user.birthdate ? "#{@user.age} yrs old" : nil].reject(&:blank?).compact.map{|u| "<span>#{u}</span>" }.join(" | ")
  end
  
  def twitter_handle(user)
    user.twitter_name ? "@#{user.twitter_name}" : ''
  end
  
  def settings_page?(page)
    case page
    when 'account'
      request.fullpath.eql? user_edit_account_info_path(current_user)
    when 'personal'
      request.fullpath.eql? user_edit_personal_info_path(current_user)
    when 'nutrition'
      request.fullpath.eql? user_edit_nutrition_info_path(current_user)
    when 'exercise'
      request.fullpath.eql? user_edit_exercise_info_path(current_user)
    when 'password'
      request.fullpath.eql? edit_password_path
    else
      false
    end
  end
  
  def active_settings_tab?(page)
    settings_page?(page) ? 'active' : ''
  end

	def age
	dob=curren_user.birthdate
   now = Time.now.utc.to_date
   now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
	end
end
