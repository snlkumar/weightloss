class CreateRatings < ActiveRecord::Migration
  def change
    create_table :ratings do |t|
      t.integer :ratingable_id
      t.string  :ratingable_type
      t.string  :ratingFor
      t.integer :ratingForid
      t.integer :rating              
      t.timestamps
    end
  end
end
