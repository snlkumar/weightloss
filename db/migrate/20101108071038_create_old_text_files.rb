class CreateOldTextFiles < ActiveRecord::Migration
  def self.up
    create_table :old_text_files do |t|
      t.string :headline
      t.string :page_title
      t.text :summary
      t.text :teaser
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :old_text_files
  end
end
