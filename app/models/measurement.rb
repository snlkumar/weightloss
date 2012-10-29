class Measurement < ActiveRecord::Base
belongs_to :user
validates_presence_of :neck, :height, :presence=>true, :on => [:create]  

end
