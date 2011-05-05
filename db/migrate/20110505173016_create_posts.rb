class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.belongs_to :user
      t.text :body
      t.string :title, :author
      t.timestamps
    end
  end

  def self.down
    drop_table :posts
  end
end
