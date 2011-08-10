Myweightworld::Application.routes.draw do
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
    
    resources :users
    resources :posts
    resources :old_text_files
    resource :dashboard
  end

  resource :user_session
  resource :tracking do
    member do
      get :charts
    end
    
    match '/charts/weight' => 'trackings#weight_over_time', :as => :weight_over_time
    match '/charts/net_calories' => 'trackings#net_calories', :as => :net_calories
  end

  resource :metabolic_rates
  resources :old_flash_files
  resources :old_success_stories
  resources :old_tip_of_days
  resources :old_text_files
  resources :old_items
  resources :old_departments
  resources :categories
  resources :subcategories
  match '/searches/new' => 'searches#new', :as => :new_search
  match '/searches' => 'searches#create', :via => :get
  resources :searches
  resources :posts
  resources :videos
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
  
  resources :custom_foods
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

  match '/privacy' => 'home#privacy', :as => :privacy
  match '/terms' => 'home#terms', :as => :terms
  match '/step_two' => 'users#step_two'
  match '/finalize' => 'users#finalize'
  match '/next' => 'users#next'
  match '/' => 'home#index', :as => :root
  match '/home' => 'users#show', :as => :home
end