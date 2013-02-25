class CreateVendormembers < ActiveRecord::Migration
  def change
    create_table :vendormembers do |t|
      t.integer :user_id
      t.integer :vendor_id
      t.timestamps :datetime
      t.integer :userApproved, :default => 0
      t.string :status                
    end
  end
end
