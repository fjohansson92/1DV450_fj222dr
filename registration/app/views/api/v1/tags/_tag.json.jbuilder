
json.id tag.id if values_t_show[:id] 
json.name tag.name if values_t_show[:name] 

if values_t_show[:links] 
	json.links do
		json.self api_v1_tag_url(tag)
		json.restaurants api_v1_tag_restaurants_url(tag)
	end
end
