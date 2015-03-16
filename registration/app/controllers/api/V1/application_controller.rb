class Api::V1::ApplicationController < ActionController::Base

	include ApiAuthenticator
	include Api::V1::SessionsHelper 

	def get_offset_limit(object)

		limit = params[:limit].to_i > 0 && params[:limit].to_i < 26 ? params[:limit].to_i : 25
		offset = params[:offset].to_i >= 0 ? params[:offset].to_i : 0

		@prev_limit = limit
		@next_limit = limit
		  
		@next_offset = offset + limit if object.length > offset + limit

		@prev_offset = offset - limit 
		if @prev_offset < 0 && offset > 0
	  		@prev_offset = 0
		elsif @prev_offset < 0
			@prev_offset = nil
		end

		last_length = object.length % limit
		last_length = limit if last_length == 0
		
		@last_offset = object.length - last_length
		@last_offset = 0 if @last_offset < 0	


		object.limit(limit).offset(offset)
	end
	
	def search_filter(restaurants)
		if params[:q]
			search = params[:q].split(' ')
			search.each do |v|
				restaurants = restaurants.includes(:apiuser, :tags).where("restaurants.name LIKE :v OR phone LIKE :v OR address LIKE :v OR description LIKE :v OR tags.name LIKE :v OR apiusers.name LIKE :v", { v: "%#{v}%"}).references(:apiusers)
			end
		end

		restaurants
	end


	def filter_response values_t_show, child_values_t_show = []

		if params[:filter]
			filter = params[:filter].gsub(/\s+/, "").split(/,/)
			
			child_values_t_show.each do |child_key, child|
				child_values_to_not_remove = []
					filter.each do |v|
						begin
							if v.start_with?(child[:selector])
								
								child_filter = v.scan(/\(([^\)]+)\)/)
								child_values_to_not_remove << child_filter[0][0]
							end
						rescue
							@error = ErrorMessage.new("Format of filter is wrong. Around value #{v}", "Request failed. Contact developer", "2201")
							render json: @error, status: :bad_request
						end	
					end
					if child_values_to_not_remove.length > 0
						filter << child[:parent_selector]
						child_values_t_show[child_key][:tagshash].each do |k, attribute|
							child_values_t_show[child_key][:tagshash].delete(k) unless child_values_to_not_remove.include?(attribute)
						end
					end
			end
			values_t_show.each do |k,v|
				values_t_show.delete(k) unless filter.include?(v)
			end
		end
		@values_t_show = values_t_show
		@child_values_t_show = child_values_t_show
				
	end

end



						


