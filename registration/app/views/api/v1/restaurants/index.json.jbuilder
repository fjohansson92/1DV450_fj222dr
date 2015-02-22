json.restaurants do
	json.array! @restaurants, partial: 'api/v1/restaurants/restaurant', as: :restaurant
end

json.links do
	json.self api_v1_restaurants_url
end