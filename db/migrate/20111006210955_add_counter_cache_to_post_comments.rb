class AddCounterCacheToPostComments < ActiveRecord::Migration
  def change
    add_column :old_text_files, :comments_count, :integer, :default => 0
    add_column :old_flash_files, :comments_count, :integer, :default => 0
  end
end
