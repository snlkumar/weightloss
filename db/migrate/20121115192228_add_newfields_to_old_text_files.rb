class AddNewfieldsToOldTextFiles < ActiveRecord::Migration
  def change
    add_column :old_text_files, :draft, :integer, :default => 0, :null => false
  end
end
