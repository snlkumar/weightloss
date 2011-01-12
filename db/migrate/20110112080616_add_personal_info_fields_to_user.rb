class AddPersonalInfoFieldsToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :bio, :text rescue nil
    add_column :users, :employer, :string rescue nil
    add_column :users, :employment_position, :string rescue nil
    add_column :users, :college, :string rescue nil
    add_column :users, :high_school, :string rescue nil
    add_column :users, :marital_status, :string rescue nil
    add_column :users, :interested_in, :string rescue nil
    add_column :users, :goals, :text rescue nil
    add_column :users, :nutritional_goals, :string rescue nil
    add_column :users, :diet, :string rescue nil
    add_column :users, :supplements, :text rescue nil
    add_column :users, :favorite_restaurants, :text rescue nil
    add_column :users, :exercise_goals, :text rescue nil
    add_column :users, :exercise_types, :text rescue nil
    add_column :users, :activities, :text rescue nil
  end

  def self.down
    remove_column :users, :activities rescue nil
    remove_column :users, :exercise_types rescue nil
    remove_column :users, :exercise_goal rescue nil
    remove_column :users, :favorite_restaurants rescue nil
    remove_column :users, :supplements rescue nil
    remove_column :users, :diet rescue nil
    remove_column :users, :nutritional_goal rescue nil
    remove_column :users, :goals rescue nil
    remove_column :users, :interested_in rescue nil
    remove_column :users, :marital_status rescue nil
    remove_column :users, :high_school rescue nil
    remove_column :users, :college rescue nil
    remove_column :users, :employment_position rescue nil
    remove_column :users, :employer rescue nil
    remove_column :users, :bio rescue nil
  end
end