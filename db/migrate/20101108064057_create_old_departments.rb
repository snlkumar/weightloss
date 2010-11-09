class CreateOldDepartments < ActiveRecord::Migration
  def self.up
    create_table :old_departments do |t|
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :old_departments
  end
end
