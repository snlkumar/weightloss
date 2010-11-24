class AddBookTitleToOldTextFiles < ActiveRecord::Migration
  def self.up
    add_column :old_text_files, :book_title, :string
  end

  def self.down
    remove_column :old_text_files, :book_title
  end
end
