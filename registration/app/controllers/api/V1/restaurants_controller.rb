class Api::V1::RestaurantsController < Api::V1::ApplicationController
	respond_to :json
	before_filter :partial_response, only: [:index, :show, :create, :update, :destroy]
	before_filter :get_restaurant, only: [:show, :update, :destroy]
	before_filter :correct_user, only: [:update, :destroy]
	before_action :logged_in_user, only: :create 

	def index

		order = params[:order_by_asc] == "true" || params[:order_by_asc] == true ? 'ASC' : 'DESC'

		@restaurants = get_offset_limit Restaurant.includes(:tags, :apiuser)::all.order("restaurants.created_at #{order}")
	end

	def show
	end

	def create
		@restaurant = current_apiuser.restaurants.new(restaurant_params)
		if @restaurant.save
			render 'show', status: :created
		else 
			@error = ErrorMessage.new("Couldn't create restaurant, see user messages.", @restaurant.errors.messages, "2203")
			render json: @error, status: :bad_request
		end
	end

	def update
		if @restaurant.update_attributes(restaurant_params)
			render 'show'
		else
			@error = ErrorMessage.new("Couldn't create restaurant, see user messages.", @restaurant.errors.messages, "2203")
			render json: @error, status: :bad_request
		end
	end

	def destroy
		@restaurant.destroy
		render json: { message: "Restaurant was removed" }, status: :ok
	end


	private

		def get_restaurant
			@restaurant = Restaurant.find_by_id(params[:id])
			if @restaurant.nil?
				@error = ErrorMessage.new("No restaurant with requested id.", "Restaurant not found", "2202")
				render json: @error, status: :not_found
			end
		end

		def correct_user
			if current_apiuser != @restaurant.apiuser
				@error = ErrorMessage.new("The restaurant didn't belong to the current apiuser.", "Forbidden to edit restaurant", "2204")
				render json: @error, status: :forbidden
			end
		end

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