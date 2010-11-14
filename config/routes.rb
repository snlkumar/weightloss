ActionController::Routing::Routes.draw do |map|
  map.resources :old_flash_files
  map.resources :old_success_stories
  map.resources :old_tip_of_days
  map.resources :old_text_files
  map.resources :old_items
  map.resources :old_departments
  map.resources :categories
  
  map.root :controller => :old_items, :action => :index
  
end
