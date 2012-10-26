class CreateMeta < ActiveRecord::Migration
  def change
    create_table :meta do |t|
      t.string :controller
      t.string :page
      t.string :metatitle
      t.string :keywords
      t.string :description

      t.timestamps
    end
  end
end
