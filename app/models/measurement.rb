class Measurement < ActiveRecord::Base
belongs_to :user
validates :height, :weight, :chest, :neck, :shoulder, :waist, :hips, :uparmleft, :forearmleft, :thighleft, :calfleft, :calfright,  :thighright, :forearmright,  :uparmright, :numericality => true, :allow_blank => true

end
