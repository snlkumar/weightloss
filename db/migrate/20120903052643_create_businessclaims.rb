class CreateBusinessclaims < ActiveRecord::Migration
  def change
    create_table :businessclaims do |t|
      t.string :claimfname
      t.string :claimlname
      t.string :claimemail
      t.string :claimcontact
      t.string :business_type      
      t.string :status            
		t.integer :vendor_id	

      t.timestamps
    end
  end
end
