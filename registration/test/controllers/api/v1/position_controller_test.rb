require 'test_helper'

class Api::V1::PositionControllerTest < Api::V1::ApplicationController

	def index

		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all.order("restaurants.created_at #{order}")
		render 'restaurants/index'
	end

end
