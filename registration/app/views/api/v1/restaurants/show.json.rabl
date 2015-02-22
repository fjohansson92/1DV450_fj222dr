object @restaurant
attributes :id, :name, :phone, :address, :description, :longitude, :latitude


child :tags do
  attributes :name
end

child :apiuser do
  extends "api/v1/apiusers/show" 
end