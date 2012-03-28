class OldTextFile < ActiveRecord::Base
  attr_accessor :remove_image1, :remove_image2, :remove_file1
  
  has_friendly_id :page_title, :use_slug => true
  
  acts_as_taggable
  acts_as_commentable
  
  # Associations
  belongs_to :category
  belongs_to :subcategory
  
  Paperclip.interpolates :normalized_image1_file_name do |attachment, style|
    attachment.instance.normalized_image1_file_name
  end
  
  Paperclip.interpolates :normalized_image2_file_name do |attachment, style|
    attachment.instance.normalized_image2_file_name
  end
  
  Paperclip.interpolates :normalized_file1_file_name do |attachment, style|
    attachment.instance.normalized_file1_file_name
  end
  
  # Paperclip
  has_attached_file :image1, :styles  => {:preview => '50x50!', :small => '100x108!', :medium => '120x120!', :med_large => '145x105!', :large => '308x200!'}, 
                             :url     => "/system/:class/:attachment/:id/:style/:normalized_image1_file_name",
                             :default_url => "/missing/:class/:attachment/:style/missing.png",
                             :path    => ":rails_root/public/system/:class/:attachment/:id/:style/:normalized_image1_file_name"
  has_attached_file :image2, :styles  => {:preview => '50x50!', :small => '100x108!', :medium => '120x120!', :med_large => '145x105!', :large => '308x200!'}, 
                             :url     => "/system/:class/:attachment/:id/:style/:normalized_image2_file_name",
                             :default_url => "/missing/:class/:attachment/:style/missing.png",
                             :path    => ":rails_root/public/system/:class/:attachment/:id/:style/:normalized_image2_file_name"
  has_attached_file :file1,  :url     => "/system/:class/:attachment/:id/:normalized_file1_file_name"                           ,
                             :path    => ":rails_root/public/system/:class/:attachment/:id/:style/:normalized_file1_file_name"
  
  # Validations
  #validates_attachment_content_type :image1, :content_type => ['image/jpeg', 'image/png', 'image/pjpeg', 'image/x-png']  
  
  # Instance Methods
  def remove_image1=(value)
    self.image1 = nil if value == '1'
  end
  
  def remove_image2=(value)
    self.image2 = nil if value == '1'
  end
  
  def remove_file1=(value)
    self.file1 = nil if value == '1'
  end
  
  def normalized_image1_file_name
    return transliterate(self.image1_file_name)
  end
  
  def normalized_image2_file_name
    return transliterate(self.image2_file_name)
  end
  
  def normalized_file1_file_name
    return transliterate(self.file1_file_name)
  end
  
  def transliterate(str)
    # Based on permalink_fu by Rick Olsen
    # Escape str by transliterating to UTF-8 with Iconv
    s = Iconv.iconv('ascii//ignore//translit', 'utf-8', str).to_s
    # Downcase string
    s.downcase!
    # Remove apostrophes so isn't changes to isnt
    s.gsub!(/'/, '')
    # Replace any non-letter or non-number character with a space
    s.gsub!(/[^A-Za-z0-9_\.]+/, ' ')
    s.strip!
    # Replace groups of spaces with single hyphen
    s.gsub!(/\ +/, '-')
    return s
  end
end
