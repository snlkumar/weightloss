class CreateExercises < ActiveRecord::Migration
  def self.up
    create_table :exercises do |t|
      t.string  :description, :category
      t.decimal :mets, :precision => 5, :scale => 2
      
      t.timestamps
    end
    
    csv = FasterCSV.read(File.join(::Rails.root.to_s, 'utils', "exercise_mets.csv"))
    headers = csv[0].collect{|col| puts col; col.downcase }
    
    csv.shift
    csv.each do |row|
      exercise = Exercise.new
      row.each_with_index do |val, index|
        if headers[index].eql?('heading')
          attr = 'category='
        else
          attr = "#{headers[index]}="
        end
        exercise.send(attr, val.try(:titleize))
      end
      exercise.save
    end
  end

  def self.down
    drop_table :exercises
  end
end
