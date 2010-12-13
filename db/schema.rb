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

ActiveRecord::Schema.define(:version => 20101213065612) do

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
  end

  create_table "old_items", :force => true do |t|
    t.string   "name"
    t.string   "sku"
    t.string   "meta_description"
    t.string   "meta_keywords"
    t.string   "unit"
    t.integer  "price",               :limit => 10, :precision => 10, :scale => 0
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
    t.integer  "shipping_2nx_item",   :limit => 10, :precision => 10, :scale => 0
    t.string   "title"
    t.integer  "inventory"
    t.integer  "warning_qty"
    t.boolean  "on_sale"
    t.boolean  "on_msrp"
    t.boolean  "tax_exempt"
    t.boolean  "free_shipping"
    t.integer  "shipping_1st_item",   :limit => 10, :precision => 10, :scale => 0
    t.integer  "shipping_2nd_item",   :limit => 10, :precision => 10, :scale => 0
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
    t.integer  "category_id"
    t.integer  "subcategory_id"
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
  end

  create_table "old_tip_of_days", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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

end
