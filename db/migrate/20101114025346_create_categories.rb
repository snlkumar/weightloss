class CreateCategories < ActiveRecord::Migration
  def self.up
    create_table :categories, :force => true do |t|

      # Needed by acts_as_category
      t.integer :parent_id
      t.integer :ancestors_count, :default => 0
      t.integer :descendants_count, :default => 0
      t.integer :children_count, :default => 0
      t.boolean :hidden
      
      # Optional
      t.string :name, :description
      t.integer :position, :pictures_count
      
    end
  end
  def self.down
    drop_table :categories
  end
end
