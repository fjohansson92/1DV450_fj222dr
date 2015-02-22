class Api::V1::RestaurantsController < ApplicationController
	respond_to :json

	def index

		@restaurants = Restaurant.includes(:tags, :apiuser)::all
	end

end
