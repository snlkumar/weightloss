class Category < ActiveRecord::Base
  acts_as_category
  
  has_many :old_text_files
  has_many :old_flash_files


	def has_content?
		self.old_flash_files.count > 0 && self.old_text_files.count > 0
	end
  
=begin
	def has_video_content?
		self.old_flash_files.count > 0
	end


	def has_text_content?
		 self.old_text_files.count > 0
	end


	def has_content?
		self.old_flash_files.count > 0 || self.old_text_files.count > 0
	end
=end

end
