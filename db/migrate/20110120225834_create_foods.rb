class CreateFoods < ActiveRecord::Migration
require 'csv'
  def self.up
    csv = CSV.read(File.join(::Rails.root.to_s, 'utils', "ABBREV.csv"))
    headers = csv[0].collect{|col| col.downcase.gsub(/\+/, '_and_') }
    
    create_table :foods, :force => true do |t|
      headers.each do |col|
        if ["shrt_desc", "gmwt_desc1", "gmwt_desc2"].include?(col)
          eval "t.string :#{col}"
        else
          eval "t.decimal :#{col}, :precision => 8, :scale => 3"
        end
      end
      t.boolean :custom
      t.string :name
      t.timestamps
    end
    
    csv.shift
    csv.each do |row|
      food = Food.new
      row.each_with_index do |val, index|
        attr = "#{headers[index]}="
        food.send(attr, val.try(:titleize))
      end
      food.name = food.shrt_desc
      food.custom = false
      food.save
    end
  end
  
  def self.down
    drop_table :foods
  end
end
