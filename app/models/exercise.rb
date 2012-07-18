class Exercise < ActiveRecord::Base
  has_attached_file :avatar, :styles      => { :medium => "50x50#", :profile => '137x137#', :large => "290x250#" }, 
                             :url  => '/system/:class/:attachment/:id/:style/:filename',
                             :path => ":rails_root/public/system/:class/:attachment/:id/:style/:filename"
end
