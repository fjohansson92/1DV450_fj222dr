json.tag do
	json.partial! @tag, partial: 'api/v1/tags/tag', as: :tag, :values_t_show => @values_t_show
end

json.links do
	json.self api_v1_tag_url(@tag)
end
