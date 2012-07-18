class CreateNewSlugs < ActiveRecord::Migration
  def up
    OldTextFile.all.each{|file| file.save }
    OldFlashFile.all.each{|file| file.save }
  end

  def down
  end
end
