class CreateFlashFiles < ActiveRecord::Migration
  def self.up
    create_table :flash_files do |t|
      t.string :title
      t.text :description
      t.text :teaser

      t.timestamps
    end
  end

  def self.down
    drop_table :flash_files
  end
end
