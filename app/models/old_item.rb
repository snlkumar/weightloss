class OldItem < ActiveRecord::Base
  attr_accessor :remove_file_1, :remove_file_2
  
  acts_as_taggable
  
  has_attached_file :file1, :url => "/system/:class/:attachment/:id/:filename"
  
  def remove_file_1=(value)
    self.file1 = nil if value == '1'
  end
end
