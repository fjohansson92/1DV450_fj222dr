json.tags do
	json.array! @tags, partial: 'api/v1/tags/tag', as: :tag, :values_t_show => @values_t_show
end
