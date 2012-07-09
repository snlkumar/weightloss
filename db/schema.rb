# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111222174939) do

  create_table "categories", :force => true do |t|
    t.integer "parent_id"
    t.integer "ancestors_count",   :default => 0
    t.integer "descendants_count", :default => 0
    t.integer "children_count",    :default => 0
    t.boolean "hidden"
    t.string  "name"
    t.string  "description"
    t.integer "position"
    t.integer "pictures_count"
  end

  create_table "comments", :force => true do |t|
    t.string   "title",            :limit => 50, :default => ""
    t.text     "comment"
    t.integer  "commentable_id"
    t.string   "commentable_type"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "comments", ["commentable_id"], :name => "index_comments_on_commentable_id"
  add_index "comments", ["commentable_type"], :name => "index_comments_on_commentable_type"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "exercises", :force => true do |t|
    t.string   "description"
    t.string   "category"
    t.decimal  "mets",        :precision => 5, :scale => 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "foods", :force => true do |t|
    t.decimal  "ndb_no",        :precision => 8, :scale => 3
    t.string   "shrt_desc"
    t.decimal  "water",         :precision => 8, :scale => 3
    t.decimal  "energ_kcal",    :precision => 8, :scale => 3
    t.decimal  "protein",       :precision => 8, :scale => 3
    t.decimal  "lipid_tot",     :precision => 8, :scale => 3
    t.decimal  "ash",           :precision => 8, :scale => 3
    t.decimal  "carbohydrt",    :precision => 8, :scale => 3
    t.decimal  "fiber_td",      :precision => 8, :scale => 3
    t.decimal  "sugar_tot",     :precision => 8, :scale => 3
    t.decimal  "calcium",       :precision => 8, :scale => 3
    t.decimal  "iron",          :precision => 8, :scale => 3
    t.decimal  "magnesium",     :precision => 8, :scale => 3
    t.decimal  "phosphorus",    :precision => 8, :scale => 3
    t.decimal  "potassium",     :precision => 8, :scale => 3
    t.decimal  "sodium",        :precision => 8, :scale => 3
    t.decimal  "zinc",          :precision => 8, :scale => 3
    t.decimal  "copper",        :precision => 8, :scale => 3
    t.decimal  "manganese",     :precision => 8, :scale => 3
    t.decimal  "selenium",      :precision => 8, :scale => 3
    t.decimal  "vit_c",         :precision => 8, :scale => 3
    t.decimal  "thiamin",       :precision => 8, :scale => 3
    t.decimal  "riboflavin",    :precision => 8, :scale => 3
    t.decimal  "niacin",        :precision => 8, :scale => 3
    t.decimal  "panto_acid",    :precision => 8, :scale => 3
    t.decimal  "vit_b6",        :precision => 8, :scale => 3
    t.decimal  "folate_tot",    :precision => 8, :scale => 3
    t.decimal  "folic_acid",    :precision => 8, :scale => 3
    t.decimal  "food_folate",   :precision => 8, :scale => 3
    t.decimal  "folate_dfe",    :precision => 8, :scale => 3
    t.decimal  "choline_tot",   :precision => 8, :scale => 3
    t.decimal  "vit_b12",       :precision => 8, :scale => 3
    t.decimal  "vit_a_iu",      :precision => 8, :scale => 3
    t.decimal  "vit_a_rae",     :precision => 8, :scale => 3
    t.decimal  "retinol",       :precision => 8, :scale => 3
    t.decimal  "alpha_carot",   :precision => 8, :scale => 3
    t.decimal  "beta_carot",    :precision => 8, :scale => 3
    t.decimal  "beta_crypt",    :precision => 8, :scale => 3
    t.decimal  "lycopene",      :precision => 8, :scale => 3
    t.decimal  "lut_and_zea",   :precision => 8, :scale => 3
    t.decimal  "vit_e",         :precision => 8, :scale => 3
    t.decimal  "vit_d_mcg",     :precision => 8, :scale => 3
    t.decimal  "vivit_d_iu",    :precision => 8, :scale => 3
    t.decimal  "vit_k",         :precision => 8, :scale => 3
    t.decimal  "fa_sat",        :precision => 8, :scale => 3
    t.decimal  "fa_mono",       :precision => 8, :scale => 3
    t.decimal  "fa_poly",       :precision => 8, :scale => 3
    t.decimal  "cholestrl",     :precision => 8, :scale => 3
    t.decimal  "gmwt_1",        :precision => 8, :scale => 3
    t.string   "gmwt_desc1"
    t.decimal  "gmwt_2",        :precision => 8, :scale => 3
    t.string   "gmwt_desc2"
    t.decimal  "refuse_pct",    :precision => 8, :scale => 3
    t.boolean  "custom"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.decimal  "total_fat",     :precision => 6, :scale => 1
    t.decimal  "saturated_fat", :precision => 6, :scale => 1
    t.decimal  "trans_fat",     :precision => 6, :scale => 1
    t.decimal  "sugar_alchol",  :precision => 6, :scale => 1
  end

  create_table "forem_forums", :force => true do |t|
    t.string "title"
    t.text   "description"
  end

  create_table "forem_posts", :force => true do |t|
    t.integer  "topic_id"
    t.text     "text"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "reply_to_id"
  end

  create_table "forem_topics", :force => true do |t|
    t.integer  "forum_id"
    t.integer  "user_id"
    t.string   "subject"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "locked",     :default => false, :null => false
    t.boolean  "pinned",     :default => false
    t.boolean  "hidden",     :default => false
  end

  create_table "forem_views", :force => true do |t|
    t.integer  "user_id"
    t.integer  "topic_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "count",      :default => 0
  end

  create_table "meal_items", :force => true do |t|
    t.integer  "meal_id"
    t.integer  "food_id"
    t.decimal  "serving",    :precision => 5, :scale => 2
    t.string   "units"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "calories"
  end

  create_table "meals", :force => true do |t|
    t.integer  "user_id"
    t.datetime "ate_on"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "meal_type"
    t.datetime "time_of_day"
  end

  create_table "old_departments", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "old_flash_files", :force => true do |t|
    t.string   "title"
    t.text     "description"
    t.text     "teaser"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "file1_file_size"
    t.datetime "file1_updated_at"
    t.string   "file1_file_name"
    t.string   "file1_content_type"
    t.integer  "file2_file_size"
    t.datetime "file2_updated_at"
    t.string   "file2_file_name"
    t.string   "file2_content_type"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.string   "vendor_name"
    t.integer  "comments_count",             :default => 0
    t.integer  "video_file_size"
    t.datetime "video_updated_at"
    t.string   "video_file_name"
    t.string   "video_content_type"
    t.integer  "preview_image_file_size"
    t.datetime "preview_image_updated_at"
    t.string   "preview_image_file_name"
    t.string   "preview_image_content_type"
    t.integer  "view_count",                 :default => 0
  end

  create_table "old_items", :force => true do |t|
    t.string   "name"
    t.string   "sku"
    t.string   "meta_description"
    t.string   "meta_keywords"
    t.string   "unit"
    t.decimal  "price",               :precision => 10, :scale => 0
    t.integer  "weight"
    t.integer  "length"
    t.integer  "width"
    t.integer  "height"
    t.string   "keywords"
    t.text     "long_description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "image1_file_size"
    t.datetime "image1_updated_at"
    t.string   "image1_file_name"
    t.string   "image1_content_type"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.string   "title"
    t.integer  "inventory"
    t.integer  "warning_qty"
    t.boolean  "on_sale"
    t.boolean  "on_msrp"
    t.boolean  "tax_exempt"
    t.boolean  "free_shipping"
    t.decimal  "shipping_1st_item",   :precision => 10, :scale => 0
    t.decimal  "shipping_2nd_item",   :precision => 10, :scale => 0
    t.string   "country_unit"
    t.boolean  "active"
    t.boolean  "featured"
    t.boolean  "best_seller"
    t.boolean  "latest_and_greatest"
    t.boolean  "recommended"
    t.string   "column_name"
    t.string   "additional_features"
    t.integer  "image2_file_size"
    t.datetime "image2_updated_at"
    t.string   "image2_file_name"
    t.string   "image2_content_type"
  end

  create_table "old_success_stories", :force => true do |t|
    t.string   "title"
    t.text     "summary"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "old_text_files", :force => true do |t|
    t.string   "page_title"
    t.text     "summary"
    t.text     "teaser"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "image1_file_size"
    t.datetime "image1_updated_at"
    t.string   "image1_file_name"
    t.string   "image1_content_type"
    t.integer  "image2_file_size"
    t.datetime "image2_updated_at"
    t.string   "image2_file_name"
    t.string   "image2_content_type"
    t.integer  "file1_file_size"
    t.datetime "file1_updated_at"
    t.string   "file1_file_name"
    t.string   "file1_content_type"
    t.integer  "category_id"
    t.integer  "subcategory_id"
    t.string   "book_title"
    t.string   "url"
    t.string   "author"
    t.integer  "comments_count",      :default => 0
    t.integer  "view_count",          :default => 0
  end

  create_table "old_tip_of_days", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", :force => true do |t|
    t.integer  "user_id"
    t.text     "body"
    t.string   "title"
    t.string   "author"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "homepage"
    t.string   "kind"
  end

  create_table "slugs", :force => true do |t|
    t.string   "name"
    t.integer  "sluggable_id"
    t.integer  "sequence",                     :default => 1, :null => false
    t.string   "sluggable_type", :limit => 40
    t.string   "scope"
    t.datetime "created_at"
  end

  add_index "slugs", ["name", "sluggable_type", "sequence", "scope"], :name => "index_slugs_on_n_s_s_and_s", :unique => true
  add_index "slugs", ["sluggable_id"], :name => "index_slugs_on_sluggable_id"

  create_table "subcategories", :force => true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "taggings", :force => true do |t|
    t.integer  "tag_id"
    t.integer  "taggable_id"
    t.string   "taggable_type"
    t.datetime "created_at"
  end

  add_index "taggings", ["tag_id"], :name => "index_taggings_on_tag_id"
  add_index "taggings", ["taggable_id", "taggable_type"], :name => "index_taggings_on_taggable_id_and_taggable_type"

  create_table "tags", :force => true do |t|
    t.string "name"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                :null => false
    t.string   "username"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "password"
    t.string   "password_confirmation"
    t.string   "status"
    t.string   "encrypted_password",                   :null => false
    t.integer  "login_count",           :default => 0, :null => false
    t.integer  "failed_login_count",    :default => 0, :null => false
    t.integer  "weight"
    t.integer  "avatar_file_size"
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.datetime "birthdate"
    t.datetime "avatar_updated_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.string   "gender"
    t.string   "height"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "bio"
    t.string   "employer"
    t.string   "employment_position"
    t.string   "college"
    t.string   "high_school"
    t.string   "marital_status"
    t.string   "interested_in"
    t.text     "goals"
    t.string   "nutritional_goals"
    t.string   "diet"
    t.text     "supplements"
    t.text     "favorite_restaurants"
    t.text     "exercise_goals"
    t.text     "exercise_types"
    t.text     "activities"
    t.boolean  "admin"
    t.integer  "activity_level"
    t.integer  "rmr"
    t.integer  "bmr"
    t.integer  "desired_weight"
    t.string   "city"
    t.string   "state"
    t.string   "twitter_name"
    t.boolean  "private"
    t.string   "permalink"
    t.string   "cached_slug"
    t.string   "reset_password_token"
    t.string   "remember_token"
    t.datetime "remember_created_at"
    t.string   "authentication_token"
    t.integer  "sign_in_count",         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "facebook_uid"
    t.string   "facebook_token"
    t.boolean  "forem_admin"
  end

  create_table "weights", :force => true do |t|
    t.integer  "user_id"
    t.integer  "weight"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "workout_items", :force => true do |t|
    t.integer  "workout_id"
    t.integer  "exercise_id"
    t.integer  "calories"
    t.integer  "duration"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  create_table "workouts", :force => true do |t|
    t.integer  "user_id"
    t.datetime "trained_on"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
