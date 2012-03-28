class AddNewPaperclipFieldsToOldFlashFiles < ActiveRecord::Migration
  def change
    add_column :old_flash_files, :video_file_size, :integer
    add_column :old_flash_files, :video_updated_at, :datetime
    add_column :old_flash_files, :video_file_name, :string
    add_column :old_flash_files, :video_content_type, :string
    
    add_column :old_flash_files, :preview_image_file_size, :integer
    add_column :old_flash_files, :preview_image_updated_at, :datetime
    add_column :old_flash_files, :preview_image_file_name, :string
    add_column :old_flash_files, :preview_image_content_type, :string
  end
end
