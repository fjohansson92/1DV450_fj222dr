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

			if !params[:lat] || params[:lat].to_s.gsub(/[^0-9]/i, '').blank?
				@error = ErrorMessage.new("Lat need to have a numeric value.", "Latitude had wrong format", "2501")
				render json: @error, status: :bad_request
			elsif !params[:lng] || params[:lng].to_s.gsub(/[^0-9]/i, '').blank?
				@error = ErrorMessage.new("Lng need to have a numeric value.", "Longitude had wrong format", "2502")
				render json: @error, status: :bad_request
			end
			lat = params[:lat].to_s.gsub(/[^0-9.-]/i, '').to_f
			lng = params[:lng].to_s.gsub(/[^0-9.-]/i, '').to_f
			
			@lat_range = Range.new(lat-2, lat + 2) 
			@lng_range = Range.new(lng-4, lng + 4) 
		end
end
