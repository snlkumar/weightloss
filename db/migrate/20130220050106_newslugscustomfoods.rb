class Newslugscustomfoods < ActiveRecord::Migration
  def up
    Food.all.each{|file| file.save }
    #OldFlashFile.all.each{|file| file.save }
  end

  def down
  end
end
