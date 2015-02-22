json.(tag, :id, :name)

json.links do
	json.self api_v1_tag_url(tag)
	json.restaurants api_v1_tag_restaurants_url(tag)
end
