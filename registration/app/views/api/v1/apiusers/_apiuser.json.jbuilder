json.id apiuser.id if values_t_show[:id] 
json.name apiuser.name if values_t_show[:name] 
if values_t_show[:links] 
	json.links do
		json.self api_v1_apiuser_url(apiuser)
		json.restaurants api_v1_apiuser_restaurants_url(apiuser)
	end
end