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
  map.resources :users
  
  map.privacy '/privacy', :controller => :home, :action => :privacy
  map.terms   '/terms',   :controller => :home, :action => :terms
  
  map.connect '/step_two', :controller => :users, :action => :step_two
  map.connect '/finalize', :controller => :users, :action => :finalize
  map.connect '/next',     :controller => :users, :action => :next
end
