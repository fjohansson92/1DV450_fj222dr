json.apiusers do
	json.array! @apiusers, partial: 'api/v1/apiusers/apiuser', as: :apiuser, :values_t_show => @values_t_show
end

json.links do
	json.self api_v1_apiusers_url

	json.first api_v1_apiusers_url(offset: 0, limit: @next_limit)

	if @prev_offset.nil?
		json.prev nil
	else
		json.prev api_v1_apiusers_url(offset: @prev_offset, limit: @prev_limit)
	end

	if @next_offset.nil?
		json.next nil
	else
		json.next api_v1_apiusers_url(offset: @next_offset, limit: @next_limit)
	end

	json.last api_v1_apiusers_url(offset: @last_offset, limit: @next_limit)
end
