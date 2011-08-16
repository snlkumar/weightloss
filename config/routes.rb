Myweightworld::Application.routes.draw do
  
  
  devise_for :users, :controllers => { :registrations => "registrations" }
  match '/password/edit' => 'user_passwords#edit', :as => :edit_password, :via => :get
  match '/password' => 'user_passwords#update', :as => :password, :via => :put
  
  namespace :admin do
    resources :exercises do
      collection do
        post :search
        get :search
      end
    end
    
    resources :foods do
      collection do
        post :search
        get :search
      end
    end
    
    resources :users, :posts, :old_text_files
    resource  :dashboard
  end
  
  resource :tracking do
    member do
      get :charts
    end
    
    match '/charts/weight' => 'trackings#weight_over_time', :as => :weight_over_time
    match '/charts/net_calories' => 'trackings#net_calories', :as => :net_calories
  end
  
  resource  :metabolic_rates
  resources :old_flash_files, :old_success_stories, :old_tip_of_days, :old_text_files, :old_items, :old_departments
  resources :categories, :subcategories, :searches, :posts, :videos, :custom_foods
  
  resources :meals do
    collection do
      post :meal_item
    end
  end
  
  resources :workouts do
    collection do
      post :workout_item
    end
  end
  
  resources :foods do
    collection do
      get :search
      post :meal_item_calories
    end
  end
  
  resources :exercises do
    collection do
      get :search
      post :workout_item_calories
    end
  end
  
  resources :users do
    collection do
      get :bmi
    end
    
    member do
      put :weight_update
      get :achievement_date
      put :bmi_update
    end
    
    match '/info/edit'      => 'users#personal_info', :as => :edit_personal_info
    match '/nutrition/edit' => 'users#nutrition_info', :as => :edit_nutrition_info
    match '/exercise/edit'  => 'users#exercise_info', :as => :edit_exercise_info
    match '/account/edit'   => 'users#account_info', :as => :edit_account_info
    resources :meals
  end
  
  post "comments/:class_name/:id",  :to => "comments#create",   :as => 'create_comment'
  match '/searches/new' => 'searches#new', :as => :new_search
  match '/searches'     => 'searches#create', :via => :get
  match '/privacy'      => 'home#privacy', :as => :privacy
  match '/terms'        => 'home#terms', :as => :terms
  match '/step_two'     => 'users#step_two'
  match '/finalize'     => 'users#finalize'
  match '/next'         => 'users#next'
  match '/home'         => 'users#show', :as => :home
  root :to => "home#index"
end