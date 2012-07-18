class AddPhotosMeasurementAfterBeforeToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :photobefore_file_name,    :string
    add_column :users, :photobefore_content_type, :string
    add_column :users, :photobefore_file_size,    :integer
    add_column :users, :photobefore_updated_at,   :datetime
    
    add_column :users, :photoafter_file_name,    :string
    add_column :users, :photoafter_content_type, :string
    add_column :users, :photoafter_file_size,    :integer
    add_column :users, :photoafter_updated_at,   :datetime
    
    add_column :users, :bodyfat,   :float
  end
  
  def self.down
    remove_column :users, :photobefore_file_name
    remove_column :users, :photobefore_content_type
    remove_column :users, :photobefore_file_size
    remove_column :users, :photobefore_updated_at

    remove_column :users, :photoafter_file_name
    remove_column :users, :photoafter_content_type
    remove_column :users, :photoafter_file_size
    remove_column :users, :photoafter_updated_at
    
    remove_column :users, :bodyfat
  end
end
