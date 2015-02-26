json.restaurant do
	json.partial! @restaurant, partial: 'api/v1/restaurants/restaurant', as: :restaurant
end

json.links do
	json.self api_v1_restaurant_url(@restaurant)
	json.restaurants api_v1_restaurants_url
end
