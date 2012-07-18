class AddPhotosAvatarFieldToFood < ActiveRecord::Migration
  def self.up
    add_column :foods, :avatar_file_name,    :string
    add_column :foods, :avatar_content_type, :string
    add_column :foods, :avatar_file_size,    :integer
    add_column :foods, :avatar_updated_at,   :datetime
    
  end
  
  def self.down
    remove_column :foods, :avatar_file_name
    remove_column :foods, :avatar_content_type
    remove_column :foods, :avatar_file_size
    remove_column :foods, :avatar_updated_at

  end
end
