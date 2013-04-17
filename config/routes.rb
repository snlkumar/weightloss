Myweightworld::Application.routes.draw do

devise_for :vendors, :controllers => { :registrations => "vendorregistrations"} do

  get '/signvendor_in', :controller => "devise/sessions", :action => "new", :as => "sign_in"
#    get '/signvendor_in', :to => 'devise/sessions#new'

 end
    
devise_for :users, :controllers => { :registrations => "registrations", :omniauth_callbacks => "users/omniauth_callbacks" } do
    get '/sign_in', :to => 'devise/sessions#new'
    get '/users/auth/:provider' => 'users/omniauth_callbacks#passthru'
   
  end




resources :notifications

if ActiveRecord::Base.connection.table_exists? 'meta'


 Meta.find(:all).each do |page|
  if page.controller.present? and page.action.present?
	case page.controller.to_s.downcase
		when "vendors"
	  		if page.action.to_s.downcase=="show"
		     match "/"+page.url.to_s+"/:id" => page.controller.to_s.titlecase+"#"+"show", :as=> "vendorInfo"
		   	elsif page.action.to_s.downcase=="search"
		   		match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"search", :as=> "vendor"
		   		elsif page.action.to_s.downcase=="vendorlogin"
		   			match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"vendorlogin", :as=> "vendorlogin_vendors"
		   			elsif page.action.to_s.downcase=="new"
		   			 match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"new", :as=> "new_vendor" 		       			                	        end
	  when "users"
	  		if page.action.to_s.downcase=="show"  
			  match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"show", :as=> "home"
				end
	  when "videos"
	  		if page.action.to_s.downcase=="index"  
			  match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"index", :as=> "videos"
			#	elsif page.action.to_s.downcase=="show"
			#		match "/"+page.url.to_s+"/:id" => page.controller.to_s.titlecase+"#"+"show", :as=> "video"	     
					end				       
	  when "posts"
	  		if page.action.to_s.downcase=="index"  
			  match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"index", :as=> "posts"
				#elsif page.action.to_s.downcase=="show"
					#match "/"+page.url.to_s+"/:id" => page.controller.to_s.titlecase+"#"+"show", :as=> "post"	     
			     end			 
	  when "home"
	  		if page.action.to_s.downcase=="about"  
			  match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"about", :as=> "about"
			    end
	  when "forum"
	  		if page.action.to_s.downcase=="forum"  
		    mount Forem::Engine, :at => "/"+page.url.to_s, :as => 'forum_engine'            
			    end	    
	  when "meals"
	  		if page.action.to_s.downcase=="new"  
			  match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"new", :as=> "new_meal"
			    end
	  when "workouts"
	  		if page.action.to_s.downcase=="new"  
			 match "/"+page.url.to_s => page.controller.to_s.titlecase+"#"+"new", :as=> "new_workout"
	  		  elsif page.action.to_s.downcase=="diary"  
			   match "/"+page.url.to_s+"/(:id)" => page.controller.to_s.titlecase+"#"+"dairy", :as=> "dairy_workout"			  
			    end
	 end
   end
 end
 
 end
 	
 	match '/autoExerciseSearch' => 'notifications#autoExerciseSearch' 	
 	match '/autoMealSearch' => 'notifications#autoMealSearch'
   match '/final'     => 'vendors#final' , :as=>"vendorfinal"
   match '/second_step'     => 'vendors#second_step'
	match '/videos/:id' =>'Videos#show', :as=> "video"
	match '/articles/:id' =>'Posts#show', :as=> "post"	
	#new added routes
	match '/admin/foods/adminApproved' =>'admin/foods#adminApproved', :as=>"adminApproved"	
	match '/admin/vendors/search' =>'admin/vendors#search'
	match '/custom_foods/new/:name' => 'custom_foods#new'
	match '/custom_foods/searchFood' => 'custom_foods#searchFood', :as=>"searchFood"	
	match '/custom_foods/(:id)/update/(:food_name)' => "custom_foods#update_meal"
	match "/workouts/calorie" =>"workouts#calculate_calories"
	
	match '/meals/data/'=>'meals#data'
	match '/workouts/data/'=>'workouts#data'
#	match '/workouts/dairy/(:id)'=>'workouts#dairy',		:as => 'dairy_workout'
	match '/refresh_window'=> 'home#refresh_window'
	
	##create dynamic routes
	match '/admin/posts/drafts' => 'admin/posts#drafts'
#	match '/admin/vendors/:id/up' =>'admin/vendors#update_vendor'

	
	
#1	match '/vendor/vendorInfo/:id/(:restaurants)/(:name)' =>'Vendors#show',  :as=>'vendorInfo'
#2	match '/vendor/(:searchtype)/(:filterQuery)' => 'Vendors#search',   :as => 'vendor'
	
	
#	match '/admin/vendors/:id' =>'admin/vendors#show'
#	match '/admin/vendors/:id/edit/(:restaurants)' =>'admin/vendors#edit_vendor'
#	match '/admin/vendors/:id/delete/(:restaurants)' =>'admin/vendors#delete_vendor'

	 
	##
  match '/password/edit' => 'user_passwords#edit', :as => :edit_password, :via => :get
  match '/password' => 'user_passwords#update', :as => :password, :via => :put
  
  get '/sign_in', :controller => "devise/sessions", :action => "new", :as => "sign_in"
#  mount Forem::Engine, :at => "/forum", :as => 'forum_engine'

  #new added routes
	match "/photos/:id/:filterPhotosByBeforeAfter"=> "Photos#filterPhotosByBeforeAfter", :as =>"before_after"
	resources :photos
  resources :vendors do
    collection do
    	get 'vendorNotificationsNew',:action=>'vendorNotificationsNew', :as=>"vendorNotificationsNew"
    	post 'vendorNotificationsCreate',:action=>'vendorNotificationsCreate', :as=>"vendorNotificationsCreate"
    	get 'userweight', :action=>'userweight', :as=> "userweight"
    	get 'userdiary/:id', :action=>'userdiary', :as=> "userdiary"
    	post 'userdiary/:id', :action=>'userdiary', :as=> "userdiary"
      post :usermeasurementcreate, :action=> :usermeasurementcreate, :as=>"usermeasurementcreate"
    	get 'usermeasurementnew/:id', :action=>'usermeasurementnew', :as=> "usermeasurementnew"
      post :userbodyfatcreate, :action=> :userbodyfatcreate, :as=>"userbodyfatcreate"
    	get 'userbodyfat/:id', :action=>'userbodyfat', :as=> "userbodyfat"
    	get 'ratings/:userid/:rating', :action=> 'ratings'
      get  'member/:id', :action=> 'memberdetails', :as=>"memberdetails"
    	post :removemember
      get  :memberlist
      post :addmywwmember
      get :addmember
      post :createmember       
      post :search_decipher
      get :search_decipher
      post :businessclaim
#3      get :vendorlogin
      post :vendorlogin1
      get :logout_vendor
		get :captchatest
		get 'auto_search/:search', :action => 'auto_search'
		get 'auto_search1/:search', :action => 'auto_search1'
		get 'auto_search2/:search', :action => 'auto_search2'
		get 'usersearch', :action => 'usersearch', :as=>"usersearch"		
		get 'profile/:id', :action => 'profile', :as=>"profile"
		get '/:id/edit/:name', :action=> 'edit'
		post :notifications, :action=>:notifications, :as=>"notifications"
    end
  end

  #end
 
#new routes for webservice

  resources :MywwWebservices do
    collection do
     #get :register_user1
      post :login
      post :register_user
      get :getSession
      post :photoGallery      
      get :check
      post :forget_pass
      post :insertWeight
      get 'getDiaryMeal/:userid/:date_on', :action =>'getDiaryMeal'
      get 'getDiaryMealDetail/:foodid/:meal_item_id', :action =>'getDiaryMealDetail'
      get 'getDiaryWorkout/:userid/:date_on', :action =>'getDiaryWorkout'
      get 'getDiaryWorkoutDetail/:workout_id/:exercise_id', :action =>'getDiaryWorkoutDetail'
		post :addWorkout
      post :addMeal
      post :goals
      get :logout
      get :avatar_path
      post :updateprofile
      post :vendor
      post :vendordetail
      get 'foodsList/:foodname', :action =>'foodsList'
      get 'exercisesList/:exercisename', :action =>'exercisesList'
		post :weightmeasurement
		post :bodymeasurement
		post :netcalories

		get 'video/video_category', :action =>'video_category'
		get 'video/:id', :action =>'show_video'
		get 'video/(:category_id)/(:filter)', :action =>'video'
		post :addWorkout1
		post :bodyfat
		post  :measurementDetails
		post  :vendormailer
		post  ':id/addcustomfood', :action=>'addcustomfood'
		get   :forumlist
		get   ':id/forumtopics', :action=>'forumtopics'
#		get   ':forum_id/:topic_id/topicposts', :action=>'topicposts'
		post   :topicposts, :action=>'topicposts'
		post  :postcomment
		post  ':id/addcustomcalories', :action=>'addcustomcalories'
    end
    member do
      post :photo
		post  'galleryPhotoUpload/:before_after', :action=>'galleryPhotoUpload'

    end
  end 
  
#end  
  
  namespace :admin do
   resources :vendors
   resources :businessclaims
   resources :meta
   resources :notifications	
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
    match '/charts/bodyfat' => 'trackings#bodyfat_over_time', :as => :bodyfat_over_time
    match '/charts/measurement' => 'trackings#measurement_over_time', :as => :measurement_over_time
  end
  
  resource  :metabolic_rates
  resources :old_flash_files, :old_success_stories, :old_tip_of_days, :old_text_files, :old_items, :old_departments
  resources :categories, :subcategories, :custom_foods
  resources :videos, :posts, :except => [:show, :index]
  
  resources :meals, :except => [:new] do
    collection do
      post :meal_item
    end
  end
  
  resources :workouts, :except=>[:new] do
    collection do
      post :workout_item
    end
  end
  
  resources :foods do
    collection do
      get :search
      post :meal_item_calories
    end
	
	member do
		get :food_servings	
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
		#new added routes
		post :bodyfat_store
		get :measurement
		post :newmeasurement
		get :bodyfatpercent
		post:bodyfatcalculate
		get :notifications
		post :notificationcreate
		get :memberships
		get :addmembership
		get :hidenotification
		put :changeNotifications				
		#end
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
#6  match '/about-us'     => 'home#about', :as => :about
  match '/step_two'     => 'users#step_two'
  match '/finalize'     => 'users#finalize'
  match '/next'         => 'users#next'
#4  match '/home'         => 'users#show', :as => :home
	#match '/meals/custom_foods/new/' => 'custom_foods#new
  root :to => "home#index"
end
