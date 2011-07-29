ActionController::Routing::Routes.draw do |map|
  
  map.namespace :admin do |admin|
    admin.resources :exercises, :collection => {:search => [:post, :get]}
    admin.resources :foods,     :collection => {:search => [:post, :get]}
    admin.resources :users, :posts
    admin.resources :old_text_files, :controller => :posts
    admin.resource :dashboard
  end
  
  map.resource  :user_session
  map.resource  :tracking, :member => {:charts => :get} do |tracking|
    map.weight_over_time '/charts/weight',       :controller => :trackings, :action => :weight_over_time
    map.net_calories     '/charts/net_calories', :controller => :trackings, :action => :net_calories
  end
  map.resource  :metabolic_rates, :path_prefix => '/user'
  
  map.resources :old_flash_files, :old_success_stories, :old_tip_of_days, :old_text_files, :old_items, :old_departments
  map.resources :categories, :subcategories
  map.new_search '/searches/new', :controller => :searches, :action => :new
  map.connect    '/searches',     :controller => :searches, :action => :create, :conditions => {:method => :get}
  map.resources :searches
  map.resources :posts, :videos
  map.resources :meals,     :collection => { :meal_item    => :post }
  map.resources :workouts,  :collection => { :workout_item => :post }
  map.resources :foods,     :collection => { :search => :get, :meal_item_calories => :post }
  map.resources :custom_foods
  map.resources :exercises, :collection => { :search => :get, :workout_item_calories => :post }
  
  map.resources :users, :member => {:bmi_update => :put, :weight_update => :put, :achievement_date => :get}, :collection => {:bmi => :get} do |user|
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
  
  map.root :controller => :home, :action => :index
end
