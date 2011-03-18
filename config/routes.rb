ActionController::Routing::Routes.draw do |map|
  map.resources :old_flash_files, :old_success_stories, :old_tip_of_days, :old_text_files, :old_items, :old_departments
  map.resources :categories, :subcategories
  map.resources :meals, :collection => { :meal_item => :post}
  map.resources :foods, :collection => {:search => :get}
  
  map.resource  :user_session, :tracking
  
  map.resources :users, :member => {:bmi_update => :put}, :collection => {:bmi => :get} do |user|
    user.edit_personal_info  '/info/edit',      :controller => :users, :action => :personal_info
    user.edit_nutrition_info '/nutrition/edit', :controller => :users, :action => :nutrition_info
    user.edit_exercise_info  '/exercise/edit',  :controller => :users, :action => :exercise_info
    user.edit_account_info   '/account/edit',   :controller => :users, :action => :account_info
    
    user.resources :meals
  end
  
  map.with_options :controller => :home do |home|
    home.privacy '/privacy', :action => :privacy
    home.terms   '/terms',   :action => :terms
  end
  
  map.with_options :controller => :users do |users|
    users.connect '/step_two', :action => :step_two
    users.connect '/finalize', :action => :finalize
    users.connect '/next',     :action => :next
  end
  
  map.root :controller => :old_items, :action => :index
end
