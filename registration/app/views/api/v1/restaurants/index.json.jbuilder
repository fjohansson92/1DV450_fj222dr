json.restaurants do
	json.array! @restaurants, partial: 'api/v1/restaurants/restaurant', as: :restaurant
end

json.links do
	json.self api_v1_restaurants_url
	json.position_search api_v1_positions_url	


	json.first api_v1_restaurants_url(offset: 0, limit: @next_limit)

	if @prev_offset.nil?
		json.prev nil
	else
		json.prev api_v1_restaurants_url(offset: @prev_offset, limit: @prev_limit)
	end

	if @next_offset.nil?
		json.next nil
	else
		json.next api_v1_restaurants_url(offset: @next_offset, limit: @next_limit)
	end

	json.last api_v1_restaurants_url(offset: @last_offset, limit: @next_limit)
end
