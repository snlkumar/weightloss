FactoryGirl.define do
  sequence :first_name_seq do |n|
    "Normal#{n}"
  end
  
  sequence :email_seq do |n|
    "user#{n}@example.com"
  end
    
  factory :user do
    first_name  { Factory.next(:first_name_seq) }
    last_name   'User'
    email       { Factory.next(:email_seq) }
    username    'normalguy'
    gender      'Male'
    status      'step_one'
    password    'password'
    password_confirmation 'password'
    avatar      File.open(File.join(::Rails.root.to_s, 'app/assets/images', 'RidingInColorado.jpg'))
  end
end