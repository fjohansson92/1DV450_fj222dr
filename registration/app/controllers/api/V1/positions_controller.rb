class Api::V1::PositionsController < Api::V1::ApplicationController
	before_filter :get_lat_lng_ranges

	def index

		@restaurants = get_offset_limit Restaurant.where(latitude: @lat_range, longitude: @lng_range)

		values_t_show = Restaurant.get_propertys_as_hash
		child_values_t_show = Restaurant.get_child_propertys_as_hash
		
		filter_response values_t_show, child_values_t_show
	end

	private 
		def get_lat_lng_ranges

			if !params[:lat_top] || params[:lat_top].to_s.gsub(/[^0-9]/i, '').blank? ||
			   !params[:lat_bottom] || params[:lat_bottom].to_s.gsub(/[^0-9]/i, '').blank? ||
			   !params[:lng_right] || params[:lng_right].to_s.gsub(/[^0-9]/i, '').blank? ||
			   !params[:lng_left] || params[:lng_left].to_s.gsub(/[^0-9]/i, '').blank? 

			   	@error = ErrorMessage.new("Missing parameter or wrong format for lat_top, lat_bottom, lng_right or lng_left.", "Something went wrong, contact developer", "2501")
				render json: @error, status: :bad_request
			end

			lat_top = params[:lat_top].to_i
			lat_bottom = params[:lat_bottom].to_i
			lng_right = params[:lng_right].to_i
			lng_left = params[:lng_left].to_i

			@lat_range = Range.new(lat_bottom, lat_top) 

			if (lng_right < lng_left) 

					@lng_range = [Range.new(-180, lng_right), Range.new(lng_left, 180)]
					
			else
				@lng_range = Range.new(lng_left, lng_right) 
			end

			
			
			
		end
end
