class AddCategoryIdToOldContent < ActiveRecord::Migration
  def self.up
    add_column :old_flash_files, :category_id, :integer
    add_column :old_text_files, :category_id, :integer
    add_column :old_items, :category_id, :integer
  end

  def self.down
    remove_column :old_items, :category_id
    remove_column :old_text_files, :category_id
    remove_column :old_flash_files, :category_id
  end
end