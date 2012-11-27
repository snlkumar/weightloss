class OldFlashFile < ActiveRecord::Base
  attr_accessor :remove_video, :remove_preview_image
  
  has_friendly_id :title, :use_slug => true
  
  acts_as_taggable
  
  # Associations
  belongs_to :category
  belongs_to :subcategory
  
  Paperclip.interpolates :normalized_video_file_name do |attachment, style|
    attachment.instance.normalized_video_file_name
  end
  
  Paperclip.interpolates :normalized_preview_image_file_name do |attachment, style|
    attachment.instance.normalized_preview_image_file_name
  end
    
  # video file
  has_attached_file :file1, :url => "/system/:class/:attachment/:id/:filename"
  # attachment/image
  # DELETE once we feel confident
  # has_attached_file :file2, :url => "/system/:class/:attachment/:id/:filename"
  
  has_attached_file :video, :url  => "/system/:class/:attachment/:id/:normalized_video_file_name",
                            :path => ":rails_root/public/system/:class/:attachment/:id/:normalized_video_file_name"
validates_attachment_content_type :video,
    :content_type => ['video/mp4', 'video/x-flv' ]


  has_attached_file :preview_image, :styles => {:large => '308x200!', :small => '145x105!'}, 
                            :url  => '/system/:class/:attachment/:id/:style/:normalized_preview_image_file_name',
                            :path => ":rails_root/public/system/:class/:attachment/:id/:style/:normalized_preview_image_file_name",
                            :default_url => "/missing/:class/:attachment/:style/missing.png"
  
  def remove_video=(value)
    self.video = nil if value == '1'
  end
  
  def remove_preview_image=(value)
    self.preview_image = nil if value == '1'
  end
  
  def normalized_video_file_name
    return transliterate(self.video_file_name)
  end
  
  def normalized_preview_image_file_name
    return transliterate(self.preview_image_file_name)
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
