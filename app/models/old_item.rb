class OldItem < ActiveRecord::Base
  attr_accessor :remove_image1, :remove_image2
  
  acts_as_taggable
  
  belongs_to :category
  belongs_to :subcategory
  
  has_attached_file :image1, :styles => {:preview => '50x50!'}, :url => "/system/:class/:attachment/:id/:style/:filename"
  has_attached_file :image2, :styles => {:preview => '50x50!'}, :url => "/system/:class/:attachment/:id/:style/:filename"
  
  def remove_image1=(value)
    self.image1 = nil if value == '1'
  end
  
  def remove_image2=(value)
    self.image2 = nil if value == '1'
  end
end
