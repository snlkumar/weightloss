class Subcategory < ActiveRecord::Base
  has_many :old_items
  has_many :old_flash_files
  has_many :old_text_files
end
