require 'csv'
class CreateFoods < ActiveRecord::Migration
  def self.up
   
  end
  
  def self.down
    drop_table :foods
  end
end