class OldItem < ActiveRecord::Base
  attr_accessor :remove_image1
  
  acts_as_taggable
  
  belongs_to :subcategory
  
  has_attached_file :image1, :styles => {:preview => '50x50!'}, :url => "/system/:class/:attachment/:id/:style/:filename"
  
  def remove_image1=(value)
    self.image1 = nil if value == '1'
  end
end
