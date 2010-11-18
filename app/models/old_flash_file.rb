class OldFlashFile < ActiveRecord::Base
  attr_accessor :remove_file_1, :remove_file_2
  
  acts_as_taggable
  
  belongs_to :subcategory
  
  has_attached_file :file1, :url => "/system/:class/:attachment/:id/:filename"
  has_attached_file :file2, :url => "/system/:class/:attachment/:id/:filename"

  def remove_file_1=(value)
    self.file1 = nil if value == '1'
  end
  
  def remove_file_2=(value)
    self.file2 = nil if value == '1'
  end
end
