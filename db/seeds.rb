# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#   
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Major.create(:name => 'Daley', :city => cities.first)
User.destroy_all
u = User.create(:first_name => 'Normal', :last_name => 'User', :email => 'user@example.com', 
            :username => 'normalguy', :gender => 'Male', :height => 72, :weight => 200,
            :password => 'password', :password_confirmation => 'password', 
            :avatar   => File.open(File.join(RAILS_ROOT, 'public/images', 'RidingInColorado.jpg')))

