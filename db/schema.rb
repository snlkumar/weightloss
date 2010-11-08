# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101108071819) do

  create_table "accounts", :force => true do |t|
    t.string   "name"
    t.string   "subdomain"
    t.string   "permalink"
    t.text     "keywords"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "plan_id"
    t.string   "status"
    t.integer  "users_count",                                :default => 0
    t.string   "new_members_approval_level"
    t.string   "invited_members_approval_level"
    t.string   "new_groups_approval_level"
    t.string   "post_approval_level"
    t.string   "event_approval_level"
    t.string   "prayer_request_approval_level"
    t.string   "gift_or_need_approval_level"
    t.string   "comment_approval_level"
    t.string   "post_contributors_approval_level"
    t.string   "event_contributors_approval_level"
    t.string   "prayer_request_contributors_approval_level"
    t.string   "gift_or_need_contributors_approval_level"
    t.string   "comment_contributors_approval_level"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "zipcode"
    t.string   "state"
    t.string   "city"
    t.string   "braintree_customer_token"
    t.string   "background_file_name"
    t.string   "background_content_type"
    t.integer  "background_file_size"
    t.datetime "background_updated_at"
    t.string   "text_logo"
  end

  create_table "activities", :force => true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.integer  "owner_id"
    t.string   "action"
    t.string   "notifiable_type"
    t.string   "connection_type"
    t.string   "target_type"
    t.integer  "notifiable_id"
    t.integer  "target_id"
    t.boolean  "viewed",          :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "alerts", :force => true do |t|
    t.integer  "group_id"
    t.string   "alertable_type"
    t.integer  "alertable_id"
    t.string   "kind"
    t.string   "status"
    t.boolean  "publishable"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
    t.boolean  "featured",       :default => false
  end

  create_table "attendees", :force => true do |t|
    t.integer  "user_id"
    t.integer  "event_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.integer  "user_id"
    t.string   "commentable_type"
    t.integer  "commentable_id"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "status"
    t.integer  "group_id"
  end

  create_table "contacts", :force => true do |t|
    t.integer  "account_id"
    t.string   "name"
    t.string   "email"
    t.string   "phone"
    t.string   "about"
    t.boolean  "show"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "default",    :default => false
  end

  create_table "credit_cards", :force => true do |t|
    t.integer  "account_id"
    t.string   "braintree_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "departments", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "events", :force => true do |t|
    t.integer  "user_id"
    t.integer  "moderator_id"
    t.integer  "group_id"
    t.string   "body"
    t.string   "title"
    t.string   "permalink"
    t.string   "location_name"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "city"
    t.string   "state"
    t.string   "zipcode"
    t.string   "privacy_level"
    t.string   "approval_method"
    t.string   "recurring_frequency"
    t.string   "moving_date_frequency"
    t.string   "moving_date_weekday"
    t.string   "status"
    t.string   "master_id"
    t.text     "recurrence_store"
    t.date     "start_date"
    t.date     "end_date"
    t.date     "recurring_end_date"
    t.time     "start_time"
    t.time     "end_time"
    t.boolean  "all_day"
    t.boolean  "allow_comments",                                        :default => true
    t.boolean  "allow_sharing",                                         :default => true
    t.boolean  "featured"
    t.boolean  "recurring"
    t.datetime "approved_at"
    t.decimal  "lat",                   :precision => 15, :scale => 10
    t.decimal  "lng",                   :precision => 15, :scale => 10
    t.integer  "comments_count",                                        :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "favors", :force => true do |t|
    t.integer  "user_id"
    t.integer  "moderator_id"
    t.integer  "group_id"
    t.string   "category"
    t.date     "start_date"
    t.date     "end_date"
    t.string   "title"
    t.text     "body"
    t.boolean  "anonymous"
    t.boolean  "fulfilled"
    t.boolean  "allow_sharing",       :default => true
    t.string   "permalink"
    t.string   "status"
    t.string   "privacy_level"
    t.string   "approval_method"
    t.boolean  "featured"
    t.datetime "deleted_at"
    t.datetime "approved_at"
    t.string   "photo1_type"
    t.string   "photo1_link"
    t.string   "photo1_file_name"
    t.string   "photo1_content_type"
    t.integer  "photo1_file_size"
    t.datetime "photo1_updated_at"
    t.string   "photo2_type"
    t.string   "photo2_link"
    t.string   "photo2_file_name"
    t.string   "photo2_content_type"
    t.integer  "photo2_file_size"
    t.datetime "photo2_updated_at"
    t.string   "photo3_type"
    t.string   "photo3_link"
    t.string   "photo3_file_name"
    t.string   "photo3_content_type"
    t.integer  "photo3_file_size"
    t.datetime "photo3_updated_at"
    t.string   "kind"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "feedbacks", :force => true do |t|
    t.integer  "user_id"
    t.string   "page"
    t.text     "body"
    t.string   "category"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "flash_files", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.text     "teaser"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "group_group_types", :force => true do |t|
    t.integer  "group_id"
    t.integer  "group_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "group_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "group_widgets", :force => true do |t|
    t.integer  "group_id"
    t.integer  "widget_id"
    t.integer  "position"
    t.boolean  "published",  :default => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "groups", :force => true do |t|
    t.text     "description"
    t.text     "tagline"
    t.integer  "widget_template_id"
    t.integer  "post_flag_threshold"
    t.integer  "avatar_file_size"
    t.integer  "memberships_count",                                             :default => 0
    t.integer  "activity_score",                                                :default => 0
    t.datetime "avatar_updated_at"
    t.boolean  "directory_listed"
    t.boolean  "auto_approve_members"
    t.boolean  "hide_facebook"
    t.boolean  "hide_twitter"
    t.string   "name"
    t.string   "permalink"
    t.string   "email"
    t.string   "phone1"
    t.string   "phone2"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "city"
    t.string   "state"
    t.string   "zipcode"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.string   "privacy_level"
    t.string   "who_can_post"
    t.string   "post_approval_level",                                           :default => "none"
    t.string   "event_approval_level",                                          :default => "none"
    t.string   "passage_approval_level",                                        :default => "none"
    t.string   "gift_or_need_approval_level",                                   :default => "none"
    t.string   "poll_approval_level",                                           :default => "none"
    t.string   "resource_approval_level",                                       :default => "none"
    t.string   "screen_name"
    t.string   "token"
    t.string   "secret"
    t.string   "fb_session_key"
    t.string   "fb_offline_enabled"
    t.string   "facebook_group_url"
    t.decimal  "lat",                           :precision => 15, :scale => 10
    t.decimal  "lng",                           :precision => 15, :scale => 10
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
    t.string   "status"
    t.string   "creator"
    t.datetime "last_activity"
    t.boolean  "homepage",                                                      :default => false
    t.string   "comment_approval_level"
    t.string   "approval_method"
    t.datetime "approved_at"
    t.integer  "moderator_id"
    t.string   "prayer_request_approval_level"
  end

  add_index "groups", ["account_id", "status"], :name => "index_groups_on_account_id_and_status"

  create_table "items", :force => true do |t|
    t.string   "name"
    t.string   "sku"
    t.string   "meta_description"
    t.string   "meta_keywords"
    t.string   "unit"
    t.integer  "price",            :limit => 10, :precision => 10, :scale => 0
    t.integer  "weight"
    t.integer  "length"
    t.integer  "width"
    t.integer  "height"
    t.string   "keywords"
    t.text     "long_description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "memberships", :force => true do |t|
    t.integer  "user_id"
    t.integer  "moderator_id"
    t.integer  "group_id"
    t.string   "status",                          :default => "pending"
    t.boolean  "admin",                           :default => false
    t.datetime "approved_at"
    t.string   "approval_method"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "group_activity_email_preference"
    t.datetime "last_activity_emailed_at"
    t.datetime "invited_at"
  end

  create_table "orders", :force => true do |t|
    t.integer  "total_in_cents"
    t.integer  "account_id"
    t.string   "status"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "zipcode"
    t.string   "state"
    t.string   "city"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "plans", :force => true do |t|
    t.string   "title"
    t.integer  "price_in_cents"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_allowances", :default => 0
  end

  create_table "posting_approval_levels", :force => true do |t|
    t.integer  "user_id"
    t.integer  "group_id"
    t.string   "level"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "homepage",   :default => false
  end

  create_table "posts", :force => true do |t|
    t.integer  "user_id"
    t.integer  "moderator_id"
    t.integer  "group_id"
    t.string   "title"
    t.string   "permalink"
    t.string   "status"
    t.string   "privacy_level"
    t.string   "approval_method"
    t.text     "body"
    t.boolean  "featured"
    t.boolean  "allow_comments",  :default => true
    t.boolean  "allow_sharing",   :default => true
    t.datetime "deleted_at"
    t.datetime "approved_at"
    t.integer  "comments_count",  :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prayer_requests", :force => true do |t|
    t.integer  "user_id"
    t.integer  "moderator_id"
    t.integer  "group_id"
    t.string   "title"
    t.string   "permalink"
    t.string   "status"
    t.string   "privacy_level"
    t.string   "approval_method"
    t.text     "body"
    t.boolean  "featured"
    t.boolean  "allow_comments",  :default => true
    t.boolean  "allow_sharing",   :default => true
    t.boolean  "answered",        :default => false
    t.datetime "deleted_at"
    t.datetime "approved_at"
    t.integer  "comments_count",  :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "prayers", :force => true do |t|
    t.integer  "user_id"
    t.integer  "prayer_request_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "reminders", :force => true do |t|
    t.integer  "user_id"
    t.string   "remindable_type"
    t.integer  "remindable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shares", :force => true do |t|
    t.string   "to"
    t.string   "from"
    t.string   "subject"
    t.text     "message"
    t.string   "shareable_type"
    t.integer  "shareable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "site_colors", :force => true do |t|
    t.integer  "group_id"
    t.string   "page_title"
    t.string   "header_footer_combo"
    t.string   "section_header"
    t.string   "post_title"
    t.string   "main_body"
    t.string   "link"
    t.string   "link_hover"
    t.string   "sidebar_link"
    t.string   "sidebar_link_hover"
    t.string   "background_color"
    t.string   "background_position"
    t.string   "background_type"
    t.string   "background_image_type"
    t.string   "button_highlight"
    t.string   "background_image_link"
    t.string   "status"
    t.boolean  "default",                       :default => false
    t.string   "background_image_file_name"
    t.string   "background_image_content_type"
    t.integer  "background_image_file_size"
    t.datetime "background_image_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "success_stories", :force => true do |t|
    t.string   "title"
    t.text     "summary"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "text_files", :force => true do |t|
    t.string   "headline"
    t.string   "page_title"
    t.text     "summary"
    t.text     "teaser"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tip_of_days", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "transaction_records", :force => true do |t|
    t.text     "account"
    t.text     "order"
    t.text     "response"
    t.text     "response_reason"
    t.text     "exception"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "backtrace"
  end

  create_table "updates", :force => true do |t|
    t.integer  "user_id"
    t.string   "updateable_type"
    t.string   "body"
    t.integer  "updateable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_types", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_user_types", :force => true do |t|
    t.integer  "user_id"
    t.integer  "user_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                                                                             :null => false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password"
    t.string   "password_confirmation"
    t.string   "mobile_phone"
    t.string   "home_phone"
    t.string   "work_phone"
    t.string   "crypted_password",                                                                                  :null => false
    t.string   "password_salt",                                                                                     :null => false
    t.string   "persistence_token",                                                                                 :null => false
    t.string   "single_access_token",                                                                               :null => false
    t.string   "perishable_token",                                                                                  :null => false
    t.integer  "login_count",                                                                    :default => 0,     :null => false
    t.integer  "failed_login_count",                                                             :default => 0,     :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.string   "fb_session_key"
    t.string   "fb_offline_enabled"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "city"
    t.string   "state"
    t.string   "zipcode"
    t.string   "permalink"
    t.string   "gender"
    t.datetime "birthdate"
    t.string   "display_age_to"
    t.string   "about_me",                        :limit => 140
    t.string   "marital_status"
    t.string   "add_update_event_prayer"
    t.string   "share_post"
    t.string   "comment_post"
    t.string   "comment_after"
    t.string   "respond_content"
    t.string   "update_event_attending"
    t.string   "update_request_praying"
    t.string   "modified_group"
    t.string   "respond_invitation"
    t.string   "alert_moderation"
    t.string   "admin_moderated_content"
    t.string   "admin_modified_post"
    t.string   "admin_modified_settings"
    t.integer  "avatar_file_size"
    t.integer  "activity_score",                                                                 :default => 0
    t.datetime "avatar_updated_at"
    t.boolean  "global_admin",                                                                   :default => false
    t.boolean  "hide_address_tooltip"
    t.boolean  "hide_reminder_tooltip"
    t.boolean  "show_mobile_phone"
    t.boolean  "show_work_phone"
    t.boolean  "show_home_phone"
    t.string   "email_privacy_level"
    t.decimal  "lat",                                            :precision => 15, :scale => 10
    t.decimal  "lng",                                            :precision => 15, :scale => 10
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_id"
    t.string   "phone_number"
    t.string   "secondary_phone"
    t.string   "status"
    t.datetime "status_changed_at"
    t.datetime "invited_at"
    t.text     "invitation_code"
    t.string   "church_updates_email_preference"
    t.string   "forgot_password_token"
    t.string   "user_approval_method"
    t.datetime "user_approved_at"
    t.integer  "moderator_id"
  end

  add_index "users", ["account_id", "status"], :name => "index_users_on_account_id_and_status"

  create_table "widget_options", :force => true do |t|
    t.integer  "group_widget_id"
    t.boolean  "default",         :default => false
    t.text     "options"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "widget_template_items", :force => true do |t|
    t.integer  "widget_template_id"
    t.integer  "widget_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "widget_templates", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "thumbnail_image_url"
    t.string   "preview_image_url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "widgets", :force => true do |t|
    t.string   "name"
    t.string   "preview_image_path"
    t.text     "description"
    t.string   "state",              :default => "inactive"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
