class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json
	before_filter :partial_response, only: [:index, :show]

	def index

		order = params[:order_by_asc] == "true" || params[:order_by_asc] == true ? 'ASC' : 'DESC'

		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all.order("restaurants.created_at #{order}")
	end

	def show
		@restaurant = Restaurant.find_by_id(params[:id])
		
		if @restaurant.nil?
			@error = ErrorMessage.new("No restaurant with requested id.", "Restaurant not found", "2202")
			render json: @error, status: :not_found
		end
	end

	private
		def partial_response
			values_t_show = Restaurant.get_propertys_as_hash
			child_values_t_show = Restaurant.get_child_propertys_as_hash
			
			filter_response values_t_show, child_values_t_show
		end
end