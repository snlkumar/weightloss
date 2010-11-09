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
  end

  create_table "old_items", :force => true do |t|
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

  create_table "old_success_stories", :force => true do |t|
    t.string   "title"
    t.text     "summary"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "old_text_files", :force => true do |t|
    t.string   "headline"
    t.string   "page_title"
    t.text     "summary"
    t.text     "teaser"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "old_tip_of_days", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
