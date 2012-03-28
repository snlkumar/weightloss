class AddViewCountToPosts < ActiveRecord::Migration
  def up
    add_column :old_text_files, :view_count, :integer, :default => 0
    add_column :old_flash_files, :view_count, :integer, :default => 0
  end
  
  def down
    remove_column :old_text_files, :view_count
    remove_column :old_flash_files, :view_count
  end
end