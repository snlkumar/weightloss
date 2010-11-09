class CreateOldFlashFiles < ActiveRecord::Migration
  def self.up
    create_table :old_flash_files do |t|
      t.string :title
      t.text :description
      t.text :teaser

      t.timestamps
    end
  end

  def self.down
    drop_table :old_flash_files
  end
end
