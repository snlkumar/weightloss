class Meta < ActiveRecord::Base
	validates_uniqueness_of :url, :case_sensitive => false #, :if => :show_action
	after_save :rebuild_routes
	after_destroy :rebuild_routes

	def rebuild_routes
	    `touch #{Rails.root}/config/routes.rb`
		#Myweightworld::Application.reload_routes!
	end
	
	def show_action
		action !="show"
	end	
	
end
