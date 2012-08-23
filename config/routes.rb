Myweightworld::Application.routes.draw do

devise_for :users, :controllers => { :registrations => "registrations", :omniauth_callbacks => "users/omniauth_callbacks" } do
    get '/sign_in', :to => 'devise/sessions#new'
    get '/users/auth/:provider' => 'users/omniauth_callbacks#passthru'
   
  end
	#new added routes
	match '/custom_foods/new/:name' => 'custom_foods#new'
	match '/custom_foods/(:id)/update/(:food_name)' => "custom_foods#update_meal"
	match "/workouts/calorie" =>"workouts#calculate_calories"
	#match '/workouts/getWorkout/'=> "workouts#getWorkout"
	#match '/workouts/saveRoutines/'=> "workouts#saveRoutines"
	match '/meals/data/'=>'meals#data'
	match '/workouts/data/'=>'workouts#data'
	match '/workouts/dairy/(:id)'=>'workouts#dairy',		:as => 'dairy_workout'
	match '/refresh_window'=> 'home#refresh_window'
	#match '/workouts/dairy/:exercise_food/:id'=>'workouts#dairy',		:as => 'dairy_workout'
	#match '/foods/search/' =>'foods#search'

	##create dynamic routes
	match '/vendor/vendorInfo/:id/(:restaurants)' =>'Vendors#show',  :as=>'vendorInfo'
	match '/vendor/(:searchtype)/(:filterQuery)' => 'Vendors#search',   :as => 'vendor'
	
	##
  match '/password/edit' => 'user_passwords#edit', :as => :edit_password, :via => :get
  match '/password' => 'user_passwords#update', :as => :password, :via => :put
  
  get '/sign_in', :controller => "devise/sessions", :action => "new", :as => "sign_in"
  mount Forem::Engine, :at => "/forum", :as => 'forum_engine'
  
  #new added routes
	match "/photos/:id/:filterPhotosByBeforeAfter"=> "Photos#filterPhotosByBeforeAfter", :as =>"before_after"
	resources :photos

  resources :vendors do
    collection do
      post :search_decipher
      get :search_decipher
    end
  end

  #end
  
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
    
    resources :users, :old_text_files
    resources :posts do
      collection do
        post :search
        get :search
      end
    end
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
  resources :categories, :subcategories, :posts, :videos, :custom_foods
  
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
  match '/searches'     => 'searches#create', :via => :get, :as => :searches
  post  '/searches'     => 'searches#create'
  match '/privacy'      => 'home#privacy', :as => :privacy
  match '/terms'        => 'home#terms', :as => :terms
  match '/about-us'     => 'home#about', :as => :about
  match '/step_two'     => 'users#step_two'
  match '/finalize'     => 'users#finalize'
  match '/next'         => 'users#next'
  match '/home'         => 'users#show', :as => :home
	#match '/meals/custom_foods/new/' => 'custom_foods#new
  root :to => "home#index"
end
