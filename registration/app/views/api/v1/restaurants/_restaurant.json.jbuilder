json.(restaurant, :id, :name, :phone, :address, :description, :longitude, :latitude)

json.links do
	json.self api_v1_restaurant_url(restaurant)
end

json.tags restaurant.tags, partial: 'api/v1/tags/tag', as: :tag

json.apiuser do
	json.name restaurant.apiuser.name
	json.links do
		json.self api_v1_apiuser_url(restaurant.apiuser)
		json.restaurants api_v1_apiuser_restaurants_url(restaurant.apiuser)
	end
end
