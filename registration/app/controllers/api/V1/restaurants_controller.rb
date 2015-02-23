class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json

	def index



		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all
	end

end
