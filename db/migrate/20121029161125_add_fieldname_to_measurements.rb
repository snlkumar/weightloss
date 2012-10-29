class AddFieldnameToMeasurements < ActiveRecord::Migration
  def change
    add_column :measurements, :weight, :float
    add_column :measurements, :shoulder, :float
  end
end
