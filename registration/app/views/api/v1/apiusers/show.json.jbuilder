json.apiuser do
	json.partial! @apiuser, partial: 'api/v1/apiusers/apiuser', as: :apiuser, :values_t_show => @values_t_show
end

json.links do
	json.self api_v1_apiuser_url(@apiuser)
end
