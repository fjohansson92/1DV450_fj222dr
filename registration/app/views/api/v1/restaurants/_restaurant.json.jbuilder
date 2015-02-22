json.(restaurant, :id, :name, :phone, :address, :description, :longitude, :latitude)

json.tags restaurant.tags, partial: 'api/v1/tags/tag', as: :tag

json.apiuser do
	json.name restaurant.apiuser.name
end
