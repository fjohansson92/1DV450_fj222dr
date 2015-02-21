class ApiStatistic < ActiveRecord::Base
	belongs_to :apikey

	def api_call
		self.call += 1
		save!
	end
end
