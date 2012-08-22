class AddPhotoToVendors < ActiveRecord::Migration
  def change
    add_column :vendors, :photo_file_name, :string
    add_column :vendors, :photo_content_type, :string
    add_column :vendors, :photo_file_size, :integer
  end
end
