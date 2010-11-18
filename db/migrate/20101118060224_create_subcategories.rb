class CreateSubcategories < ActiveRecord::Migration
  def self.up
    create_table :subcategories do |t|
      t.string :name

      t.timestamps
    end
    add_column :old_flash_files, :subcategory_id, :integer
    add_column :old_items, :subcategory_id, :integer
    add_column :old_text_files, :subcategory_id, :integer
  end

  def self.down
    remove_column :old_text_files, :subcategory_id
    remove_column :old_items, :subcategory_id
    remove_column :old_flash_files, :subcategory_id
    drop_table :subcategories
  end
end