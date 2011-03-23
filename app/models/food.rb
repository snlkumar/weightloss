class Food < ActiveRecord::Base
  named_scope :with_serving_sizes, :conditions => "gmwt_desc1 is NOT NULL and gmwt_desc2 is NOT NULL"
end
