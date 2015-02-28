class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json
	before_filter :partial_response, only: [:index, :show, :create]
	before_action :logged_in_user, only: :create 

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

	def create
		@restaurant = current_apiuser.restaurants.new(restaurant_params)
		if @restaurant.save
			render 'show', status: :created
		else 
			@error = ErrorMessage.new("Couldn't create restaurant, see user messages.", @restaurant.errors.messages, "2402")
			render json: @error, status: :bad_request
		end
	end


	private
		def logged_in_user
			unless apiuser_logged_in?
				@error = ErrorMessage.new("The user needs to login", "Bad credentials", "1401")
				render json: @error, status: :unauthorized
			end
		end

		def restaurant_params
			params.require(:restaurant).permit(:name, :phone, :address, :longitude, :latitude, :description, :tags_attributes => [:name])
		end

		def partial_response
			values_t_show = Restaurant.get_propertys_as_hash
			child_values_t_show = Restaurant.get_child_propertys_as_hash
			
			filter_response values_t_show, child_values_t_show
		end
end