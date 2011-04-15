module UsersHelper
  
  def user_mini_info(user)
    [@user.employment_position, @user.marital_status.try(:titleize), @user.birthdate ? "#{@user.age} yrs old" : nil].reject(&:blank?).compact.map{|u| "<span>#{u}</span>" }.join(" | ")
  end
end
