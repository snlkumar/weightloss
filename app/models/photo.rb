class Photo < ActiveRecord::Base
validates_attachment_presence :photo
belongs_to :user
has_attached_file :photo, :styles      => { :thumb   => "16x16#",   :small => "40x40#", :medium => "50x50#",		
                                               :profile => '137x137#', :large => "214x214#" }, :url  => '/system/photos/:id/:style/:filename'                             
end
