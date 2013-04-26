class AddFoodCategoryToFoods < ActiveRecord::Migration
  def up
    add_column :foods, :food_category, :string, :default => "0"
  end

end
