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
	  		@prev_limit = offset
		elsif @prev_offset < 0
			@prev_offset = nil
		end

		@last_offset = object.length - limit	
		@last_offset = 0 if @last_offset < 0	


		object.limit(limit).offset(offset)
	end

	def filter_restaurants_response values_t_show, child_values_t_show

		values_t_show = { :id => "id", 
				 :name => "name", 
				 :phone => "phone", 
				 :address => "address", 
				 :longitude => "longitude", 
				 :latitude => "latitude", 
				 :description => "description",
				 :links => "links",
				 :tags => "tags",
				 :apiuser => 'apiuser'
				}

		child_values_t_show = { :tags => { :selector => "tags(", 
								 		   :tagshash => { :id => "id",
														  :name => "name",
														  :links => "links" }},
								:apiuser => { :selector => "apiuser(", 
											  :tagshash => {:name => "name",
											  				:links => "links"}} 
					}

		if params[:filter]
			filter = params[:filter].split(/,/)
			
			filter.each do |v|
				child_values_t_show.each do |child_key, child|
					if v.start_with?(child[:selector])
						
						child_filter = v.scan(/\(([^\)]+)\)/).first

						child_values_t_show[child_key][:tagshash].each do |k, attribute|
							child_values_t_show[child_key][:tagshash].delete(k) unless child_filter.include?(attribute)
						end
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






