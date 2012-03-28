namespace :sync do
  desc "Sync the counter caches"
  task :comments => :environment do
    posts = OldTextFile.all
    
    posts.each do |post|
      OldTextFile.update_counters post.id, :comments_count => post.comments.count
    end
    
  end
end