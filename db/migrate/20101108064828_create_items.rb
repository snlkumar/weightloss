class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.string :name
      t.string :sku
      t.string :meta_description
      t.string :meta_keywords
      t.string :unit
      t.decimal :price
      t.integer :weight
      t.integer :length
      t.integer :width
      t.integer :height
      t.string :keywords
      t.text :long_description

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end
