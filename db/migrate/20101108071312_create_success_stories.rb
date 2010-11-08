class CreateSuccessStories < ActiveRecord::Migration
  def self.up
    create_table :success_stories do |t|
      t.string :title
      t.text :summary
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :success_stories
  end
end
