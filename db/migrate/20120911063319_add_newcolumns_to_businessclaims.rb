class AddNewcolumnsToBusinessclaims < ActiveRecord::Migration
  def change
    add_column :businessclaims, :password, :string
  end
end
