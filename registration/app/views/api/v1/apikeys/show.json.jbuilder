json.apikey do
	json.partial! @apikey, partial: 'api/v1/apikeys/apikey', as: :apikey
	json.statistics @apikey.api_statistics do |stat|
		json.requests stat.call
		json.day stat.created_at
	end
end


json.links do
	json.self api_v1_apikey_url(@apikey)
end
