ActionController::Routing::Routes.draw do |map|
  map.resources :old_flash_files
  map.resources :old_success_stories
  map.resources :old_tip_of_days
  map.resources :old_text_files
  map.resources :old_items
  map.resources :old_departments
  map.resources :categories
  map.resources :subcategories
  
  map.root :controller => :old_items, :action => :index
  
  map.resource  :user_session
  map.resources :users do |user|
    user.edit_personal_info  '/info/edit',      :controller => :users, :action => :personal_info
    user.edit_nutrition_info '/nutrition/edit', :controller => :users, :action => :nutrition_info
    user.edit_exercise_info  '/exercise/edit',  :controller => :users, :action => :exercise_info
  end
  
  map.privacy '/privacy', :controller => :home, :action => :privacy
  map.terms   '/terms',   :controller => :home, :action => :terms
  
  map.connect '/step_two', :controller => :users, :action => :step_two
  map.connect '/finalize', :controller => :users, :action => :finalize
  map.connect '/next',     :controller => :users, :action => :next
end
