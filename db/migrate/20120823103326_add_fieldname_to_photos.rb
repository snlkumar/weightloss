class AddFieldnameToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :before_after, :string
  end
end
