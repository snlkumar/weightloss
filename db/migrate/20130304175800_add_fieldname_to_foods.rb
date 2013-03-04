class AddFieldnameToFoods < ActiveRecord::Migration
  def change  
      add_column :foods, :adminApproved, :integer,:default => 1
  end
end
