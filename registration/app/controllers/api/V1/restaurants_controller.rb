class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json

	def index

		order = params[:order_by_asc] == "true" || params[:order_by_asc] == true ? 'ASC' : 'DESC'


		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all.order("restaurants.created_at #{order}")

		values_t_show = Restaurant.get_propertys_as_hash
		child_values_t_show = Restaurant.get_child_propertys_as_hash
		
		filter_restaurants_response values_t_show, child_values_t_show
	end




end