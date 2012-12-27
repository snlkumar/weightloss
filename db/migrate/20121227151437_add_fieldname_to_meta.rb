class AddFieldnameToMeta < ActiveRecord::Migration
  def change
  	add_column :meta, :action, :string
   add_column :meta, :url, :string  
  end
end
