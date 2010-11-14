class AddFileFields < ActiveRecord::Migration
  def self.up
    add_column :old_flash_files, :file1_file_size, :integer
    add_column :old_flash_files, :file1_updated_at, :datetime
    add_column :old_flash_files, :file1_file_name, :string
    add_column :old_flash_files, :file1_content_type, :string
    
    add_column :old_flash_files, :file2_file_size, :integer
    add_column :old_flash_files, :file2_updated_at, :datetime
    add_column :old_flash_files, :file2_file_name, :string
    add_column :old_flash_files, :file2_content_type, :string
    
    add_column :old_items, :file1_file_size, :integer
    add_column :old_items, :file1_updated_at, :datetime
    add_column :old_items, :file1_file_name, :string
    add_column :old_items, :file1_content_type, :string
  end

  def self.down
    remove_column :old_flash_files, :file1_content_type
    remove_column :old_flash_files, :file1_file_name
    remove_column :old_flash_files, :file1_updated_at
    remove_column :old_flash_files, :file1_file_size
    
    remove_column :old_flash_files, :file2_content_type
    remove_column :old_flash_files, :file2_file_name
    remove_column :old_flash_files, :file2_updated_at
    remove_column :old_flash_files, :file2_file_size
    
    remove_column :old_items, :file1_content_type
    remove_column :old_items, :file1_file_name
    remove_column :old_items, :file1_updated_at
    remove_column :old_items, :file1_file_size
  end
end