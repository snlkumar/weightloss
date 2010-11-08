class CreateTextFiles < ActiveRecord::Migration
  def self.up
    create_table :text_files do |t|
      t.string :headline
      t.string :page_title
      t.text :summary
      t.text :teaser
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :text_files
  end
end
