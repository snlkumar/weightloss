class RemoveHeadlineFromOldTextFiles < ActiveRecord::Migration
  def self.up
    remove_column :old_text_files, :headline
  end

  def self.down
    add_column :old_text_files, :headline, :string
  end
end
