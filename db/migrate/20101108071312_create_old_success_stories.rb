class CreateOldSuccessStories < ActiveRecord::Migration
  def self.up
    create_table :old_success_stories do |t|
      t.string :title
      t.text :summary
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :old_success_stories
  end
end
