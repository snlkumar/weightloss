class Food < ActiveRecord::Base
  named_scope :with_a_serving_size, :conditions => "gmwt_desc1 is NOT NULL OR gmwt_desc2 is NOT NULL"
end
