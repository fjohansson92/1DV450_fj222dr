
json.id restaurant.id if @values_t_show[:id] 
json.name restaurant.name if @values_t_show[:name] 
json.phone restaurant.phone if @values_t_show[:phone] 
json.address restaurant.address if @values_t_show[:address] 
json.description restaurant.description if @values_t_show[:description] 
json.longitude restaurant.longitude if @values_t_show[:longitude] 
json.latitude restaurant.latitude if @values_t_show[:latitude] 

if @values_t_show[:links]
	json.links do
		json.self api_v1_restaurant_url(restaurant)
	end
end
if @values_t_show[:tags]
	json.tags restaurant.tags, partial: 'api/v1/tags/tag', as: :tag, :values_t_show => @child_values_t_show[:tags][:tagshash]
end

if @values_t_show[:apiuser] 
	json.apiuser do
		json.partial! 'api/v1/apiusers/apiuser', :apiuser => restaurant.apiuser, :values_t_show => @child_values_t_show[:apiuser][:tagshash]
	end
end
