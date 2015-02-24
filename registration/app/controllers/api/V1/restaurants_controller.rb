class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json

	def index

		order = params[:order_by_asc] == "true" || params[:order_by_asc] == true ? 'ASC' : 'DESC'


		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all.order("restaurants.created_at #{order}")
		
		
		filter_restaurants_response nil, nil
	end

end