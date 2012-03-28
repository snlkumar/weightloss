namespace :reassign do
  desc ""
  task :videos => :environment do
    videos = OldFlashFile.all
    videos.each do |video|
      video.video = File.open(video.file1.path.gsub("%20", ' '))
      unless video.file2_content_type.eql?('application/vnd.ms-powerpoint')
        video.preview_image = video.file2
      end
      video.save
    end
  end
  
  task :preview_images => :environment do
    videos = OldFlashFile.all
    videos.each do |video|
      unless video.file2_content_type.eql?('application/vnd.ms-powerpoint')
        video.preview_image = video.file2
      end
      video.save
    end
  end
end