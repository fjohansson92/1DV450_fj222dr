require 'test_helper'


def test_restaurant_json(first_restaurant, first_response_restaurant)
	
	assert_equal first_restaurant.name, first_response_restaurant["name"]
	assert_equal first_restaurant.phone, first_response_restaurant["phone"]
	assert_equal first_restaurant.address, first_response_restaurant["address"]
	assert_equal first_restaurant.description, first_response_restaurant["description"]
	assert_in_delta first_restaurant.longitude, first_response_restaurant["longitude"].to_f
	assert_in_delta first_restaurant.latitude, first_response_restaurant["latitude"].to_f
	assert_equal api_v1_restaurant_url(first_restaurant), first_response_restaurant["links"]["self"]



	first_restaurant_tags = first_restaurant.tags
	first_response_restaurant_tags = first_response_restaurant["tags"]

	assert_equal first_restaurant_tags.length, first_response_restaurant_tags.length

	assert_equal first_restaurant_tags.first.name, first_response_restaurant_tags.first["name"]
	assert_equal api_v1_tag_url(first_restaurant_tags.first), first_response_restaurant_tags.first["links"]["self"]
	assert_equal api_v1_tag_restaurants_url(first_restaurant_tags.first), first_response_restaurant_tags.first["links"]["restaurants"]

	assert_equal first_restaurant_tags.last.name, first_response_restaurant_tags.last["name"]



	first_restaurant_apiuser = first_restaurant.apiuser
	first_response_restaurant_apiuser = first_response_restaurant["apiuser"]

	assert_equal first_restaurant_apiuser.name, first_response_restaurant_apiuser["name"]
	assert_equal api_v1_apiuser_url(first_restaurant_apiuser), first_response_restaurant_apiuser["links"]["self"]
	assert_equal api_v1_apiuser_restaurants_url(first_restaurant_apiuser), first_response_restaurant_apiuser["links"]["restaurants"]
end

class Api::V1::RestaurantsControllerTest < ActionController::TestCase

	def setup

		@apiuser = apiusers(:filip)

    	apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
    	request.headers['auth-token'] = @apiuser.auth_token
    	request.headers['user-token'] = @apiuser.user_token
	end

	test "should get list of restaurants" do
		
		get :index, {  order_by_asc: true, :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['restaurants']

		@restaurants = Restaurant::all

		assert_equal body['restaurants'].length, 25

		assert_equal body['links']["self"], api_v1_restaurants_url
		assert_equal body['links']["first"], api_v1_restaurants_url + "?limit=25&offset=0"
		assert_not body['links']["prev"]
		assert_equal body['links']["next"], api_v1_restaurants_url + "?limit=25&offset=25"
		assert_equal body['links']["last"], api_v1_restaurants_url + "?limit=25&offset=7"



		first_restaurant = @restaurants.first
		first_response_restaurant = body['restaurants'].first


		test_restaurant_json(first_restaurant, first_response_restaurant)
	end


	test "should not get all user info" do
		
		get :index, :format => :json
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['restaurants']

		@restaurants = Restaurant::all

		first_response_restaurant_apiuser = body['restaurants'].first["apiuser"]

		assert first_response_restaurant_apiuser["id"]
		assert first_response_restaurant_apiuser["name"]
		assert_not first_response_restaurant_apiuser["provider"]
		assert_not first_response_restaurant_apiuser["uid"]
		assert_not first_response_restaurant_apiuser["auth_token"]
		assert_not first_response_restaurant_apiuser["token_expires"]
	end


	test "should get desc order" do 
		get :index, { :format => :json }
		assert_response :ok

		assert_equal Restaurant::all.last, assigns(:restaurants).first 
	end



	test "should partial only name" do
		get :index, {  filter: "name", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		restaurant = Restaurant::all.last
		assert_equal body['restaurants'].first, { "name" => restaurant.name }
	end

	test "should partial multiple attributes" do
		get :index, {  filter: "name,phone,address,description", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		restaurant = Restaurant::all.last
		assert_equal ({ "name" => restaurant.name, 
						"phone" => restaurant.phone,
						"description" => restaurant.description,
						"address" => restaurant.address
						 }), body['restaurants'].first
	end

	test "should partial multiple attributes with spaces" do
		get :index, {  filter: "name , phone", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		restaurant = Restaurant::all.last
		assert_equal ({ "name" => restaurant.name, 
						"phone" => restaurant.phone
						 }), body['restaurants'].first
	end

	test "should partial with tags" do

		get :index, {  order_by_asc: true, filter: "tags", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		tag = Restaurant::all.first.tags.first
		
		assert_equal  tag.id, body['restaurants'].first["tags"].first["id"]
		assert_equal  tag.name, body['restaurants'].first["tags"].first["name"]
		assert  body['restaurants'].first["tags"].first["links"]
		assert  body['restaurants'].first["tags"].first["links"]["self"]
		assert  body['restaurants'].first["tags"].first["links"]["restaurants"]
	end

	test "should partial with tags name" do

		get :index, {  order_by_asc: true, filter: "tags(name)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		tag = Restaurant::all.first.tags.first
		
		assert_equal ({ "name" => tag.name}), body["restaurants"].first["tags"].first
	end

	test "should partial with tags name and id" do

		get :index, {  order_by_asc: true, filter: "tags(name),tags(id)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		tag = Restaurant::all.first.tags.first
		
		assert_equal ({ "id" => tag.id, "name" => tag.name}), body["restaurants"].first["tags"].first
	end

	test "should partial with tags links" do

		get :index, {  order_by_asc: true, filter: "tags(links)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		assert  body['restaurants'].first["tags"].first["links"]
		assert  body['restaurants'].first["tags"].first["links"]["self"]
		assert  body['restaurants'].first["tags"].first["links"]["restaurants"]
	end

	test "should partial with apiuser" do

		get :index, {  order_by_asc: true, filter: "apiuser", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		apiuser = Restaurant::all.first.apiuser
		
		assert_equal  apiuser.id, body['restaurants'].first['apiuser']['id']
		assert_equal  apiuser.name, body['restaurants'].first['apiuser']['name']

		assert  body['restaurants'].first["apiuser"]["links"]
		assert  body['restaurants'].first["apiuser"]["links"]["self"]
		assert  body['restaurants'].first["apiuser"]["links"]["restaurants"]
	end

	test "should partial with apiuser name" do
		get :index, {  order_by_asc: true, filter: "apiuser(name)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		apiuser = Restaurant::all.first.apiuser
		
		assert_equal ({ "name" => apiuser.name}), body["restaurants"].first["apiuser"]
	end

	test "should partial with apiuser name and id" do
		get :index, {  order_by_asc: true, filter: "apiuser(name),apiuser(id)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
			
		apiuser = Restaurant::all.first.apiuser
		
		assert_equal ({ "id" => apiuser.id, "name" => apiuser.name}), body["restaurants"].first["apiuser"]
	end

	test "should partial with apiuser links" do
		get :index, {  order_by_asc: true, filter: "apiuser(links)", format: :json }
		assert_response :ok

		body = JSON.parse(@response.body)
		
		assert  body['restaurants'].first["apiuser"]["links"]
		assert  body['restaurants'].first["apiuser"]["links"]["self"]
		assert  body['restaurants'].first["apiuser"]["links"]["restaurants"]
	end



	test "should get error if filter is wrong format" do
		get :index, {  filter: "apiuser(error,)", :format => :json }
		
		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end







	test "should show restaurant" do

		restaurant = Restaurant::find(1)

		get :show, { id: restaurant.id, :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert  body['restaurant']
		assert_equal body['links']["self"], api_v1_restaurant_url(restaurant)
		assert_equal body['links']["restaurants"], api_v1_restaurants_url


		test_restaurant_json(restaurant, body['restaurant'])
	end

	test "should get error if restaurant not found" do
		get :show, {  id: 1000, :format => :json }
		
		assert_response :not_found
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "partial should work with single restaurant too" do

		restaurant = Restaurant::find(1)

		get :show, { id: restaurant.id, filter: "name,phone,address,description", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert_equal ({ "name" => restaurant.name, 
						"phone" => restaurant.phone,
						"description" => restaurant.description,
						"address" => restaurant.address
						 }), body['restaurant']
	end








	# Create restaurant tests

	test "should create restaurant" do

		name = "Pizzerian Unik"
		phone = "0123456"
		address = "Gatan 5, 333 33 Kalmar"
		longitude = 12.45689
		latitude = 20.12365
		description = "Säljer pizzor"
		tag1 = "Pizzeria"
		tag2 = "Kebab"



		assert_difference 'Restaurant.count', 1 do
			assert_difference 'Tag.count', 2 do
				post :create, { :format => :json, restaurant: {
												:name => name,
												:phone => phone,
												:address => address,
												:longitude =>  longitude,
												:latitude =>  latitude,
												:description => description,
												:tags_attributes => [{name: tag1}, {name: tag2}]
											}} 
				assert_response :created
			end
		end

		restaurant = Restaurant.find_by_name("Pizzerian Unik")

		body = JSON.parse(@response.body)

		assert  body['restaurant']
		assert_equal body['links']["self"], api_v1_restaurant_url(restaurant)
		assert_equal body['links']["restaurants"], api_v1_restaurants_url

		test_restaurant_json(restaurant, body['restaurant'])

		assert_equal name, body['restaurant']["name"]
		assert_equal phone, body['restaurant']["phone"]
		assert_equal address, body['restaurant']["address"]
		assert_equal description, body['restaurant']["description"]
		assert_in_delta longitude, body['restaurant']["longitude"].to_f
		assert_in_delta latitude, body['restaurant']["latitude"].to_f
		assert_equal tag1, body['restaurant']["tags"].first["name"]
		assert_equal tag2, body['restaurant']["tags"].last["name"]
	end

	test "tags should not duplicate" do
	
		assert_difference 'Restaurant.count', 1 do
			assert_difference 'Tag.count', 2 do
				post :create, { :format => :json, restaurant: {
												:name => "Pizzerian", 
												:phone => "0123456", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "12.45689", 
												:latitude => "20.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{name: "Pizzeria"}, {name: "Kebab"}]
											}} 
				assert_response :created
			end
		end
		


		assert_difference 'Restaurant.count', 1 do
			assert_no_difference 'Tag.count' do
				post :create, { :format => :json, restaurant: {
												:name => "Andra Pizzerian", 
												:phone => "0123456", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "30.45689", 
												:latitude => "40.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{name: "Pizzeria"}, {name: "Kebab"}]
											}} 
				assert_response :created
			end
		end
	end

	test "should create restaurant without tags" do
	
		assert_difference 'Restaurant.count', 1 do
			post :create, { :format => :json, restaurant: {
											:name => "Pizzerian", 
											:phone => "0123456", 
											:address => "Gatan 5, 333 33 Kalmar", 
											:longitude => "12.45689", 
											:latitude => "20.123654", 
											:description => "Säljer pizzor"
										}} 
			assert_response :created
		end
	end

	test "should partial restaurant" do
	
		name = "Pizzerian"
		post :create, { :format => :json, filter: "name", restaurant: {
										:name => name, 
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "12.45689", 
										:latitude => "20.123654", 
										:description => "Säljer pizzor"
									}} 
		assert_response :created

		body = JSON.parse(@response.body)

		assert_equal ({ "name" => name }), body['restaurant']
	end

	test "should fail to create restaurant if invalid restaurant" do
	
		assert_no_difference 'Restaurant.count' do
			assert_no_difference 'Tag.count' do
				post :create, { :format => :json, restaurant: {
												:name => "Pizzerian", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "12.45689", 
												:latitude => "20.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{name: "Pizzeria"}, {name: "Kebab"}]
											}} 
			end
		end

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to create restaurant if invalid tag" do
	
		assert_no_difference 'Restaurant.count' do
			assert_no_difference 'Tag.count' do
				post :create, { :format => :json, restaurant: {
												:name => "Pizzerian", 
												:phone => "0123456", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "12.45689", 
												:latitude => "20.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{id: 123}, {name: "Kebab"}]
											}} 
			end
		end

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end








	test "should remove restaurant" do
		restaurant = @apiuser.restaurants.first
		assert_difference 'Restaurant.count', -1 do
			assert_no_difference 'Tag.count' do
				delete :destroy, { id: restaurant.id ,:format => :json }
				assert_response :ok
				message = JSON.parse(@response.body)
				assert message['message']
			end
		end
	end

	test "should not be able to remove removed restaurant" do
		restaurant = @apiuser.restaurants.first
		delete :destroy, { id: restaurant.id ,:format => :json }
		assert_response :ok

		delete :destroy, { id: restaurant.id ,:format => :json }
		assert_response :not_found
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should not be able to remove other users restaurant" do
		restaurant = restaurants(:restaurant_to_remove)
		assert_no_difference 'Restaurant.count' do
			assert_no_difference 'Tag.count' do
				delete :destroy, { id: restaurant.id ,:format => :json }
				
				assert_response :forbidden
				error = JSON.parse(@response.body)
				assert error['developerMessage']
				assert error['userMessage']
			end
		end

	end







	# Update restaurant tests
	
	test "should update restaurant" do

		name = "Pizzerian Unik"
		phone = "0123456"
		address = "Gatan 5, 333 33 Kalmar"
		longitude = 12.45689
		latitude = 20.12365
		description = "Säljer pizzor"
		tag1 = "Pizzeria"
		tag2 = "Kebab"

		restaurant = restaurants(:restaurant)

		assert_difference 'Tag.count', 2 do
			patch :update, { id: restaurant.id, :format => :json, restaurant: {
											:name => name,
											:phone => phone,
											:address => address,
											:longitude =>  longitude,
											:latitude =>  latitude,
											:description => description,
											:tags_attributes => [{name: tag1}, {name: tag2}]
										}} 
			assert_response :ok
		end

		restaurant = Restaurant.find_by_name("Pizzerian Unik")

		body = JSON.parse(@response.body)

		assert  body['restaurant']
		assert_equal body['links']["self"], api_v1_restaurant_url(restaurant)
		assert_equal body['links']["restaurants"], api_v1_restaurants_url

		test_restaurant_json(restaurant, body['restaurant'])

		assert_equal name, body['restaurant']["name"]
		assert_equal phone, body['restaurant']["phone"]
		assert_equal address, body['restaurant']["address"]
		assert_equal description, body['restaurant']["description"]
		assert_in_delta longitude, body['restaurant']["longitude"].to_f
		assert_in_delta latitude, body['restaurant']["latitude"].to_f
		assert_equal tag1, body['restaurant']["tags"].first["name"]
		assert_equal tag2, body['restaurant']["tags"].last["name"]
	end	

	test "tags should not duplicate on update" do
	
		id = 0
		assert_difference 'Restaurant.count', 1 do
			assert_difference 'Tag.count', 2 do
				post :create, { :format => :json, restaurant: {
												:name => "Pizzerian", 
												:phone => "0123456", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "12.45689", 
												:latitude => "20.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{name: "Pizzeria"}, {name: "Kebab"}]
											}} 
				assert_response :created
				body = JSON.parse(@response.body)
				id = body['restaurant']['id'].to_i
			end
		end

		assert_no_difference 'Restaurant.count' do
			assert_no_difference 'Tag.count' do
				patch :update, { id: id, :format => :json, restaurant: {
												:name => "Andra Pizzerian", 
												:phone => "0123456", 
												:address => "Gatan 5, 333 33 Kalmar", 
												:longitude => "30.45689", 
												:latitude => "40.123654", 
												:description => "Säljer pizzor",
												:tags_attributes => [{name: "Pizzeria"}, {name: "Kebab"}]
											}} 
				assert_response :ok
			end
		end
	end

	test "should be able to remove tags from restaurant" do
		restaurant = restaurants(:restaurant)

		patch :update, { id: restaurant.id, :format => :json, restaurant: {
										:name => "Andra Pizzerian", 
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "30.45689", 
										:latitude => "40.123654", 
										:description => "Säljer pizzor",
										:tags => []
									}} 
		assert_response :ok

		assert_equal 0, restaurant.tags.length
	end

	test "should partial restaurant on update" do
		restaurant = restaurants(:restaurant)

		name = "Pizzerian"
		patch :update, { id: restaurant.id, :format => :json, filter: "name", restaurant: {
										:name => name, 
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "12.45689", 
										:latitude => "20.123654", 
										:description => "Säljer pizzor"
									}} 
		assert_response :ok

		body = JSON.parse(@response.body)

		assert_equal ({ "name" => name }), body['restaurant']
	end




	test "should fail to update restaurant if invalid restaurant" do
	
		restaurant = restaurants(:restaurant)

		patch :update, { id: restaurant.id, :format => :json, filter: "name", restaurant: {
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "12.45689", 
										:latitude => "not number", 
										:description => "Säljer pizzor"
									}} 
		assert_response :bad_request


		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to update restaurant if invalid tag" do
	
		restaurant = restaurants(:restaurant)

		patch :update, { id: restaurant.id, :format => :json, filter: "name", restaurant: {
										:name => "Pizzerian", 
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "12.45689", 
										:latitude => "20.123654", 
										:description => "Säljer pizzor",
										:tags_attributes => [{id: 123}, {name: "Kebab"}]
									}} 

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should not be able to update other users restaurant" do
		restaurant = restaurants(:restaurant_to_remove)
		patch :update, { id: restaurant.id, :format => :json, filter: "name", restaurant: {
										:name => "Pizzerian", 
										:phone => "0123456", 
										:address => "Gatan 5, 333 33 Kalmar", 
										:longitude => "12.45689", 
										:latitude => "20.123654", 
										:description => "Säljer pizzor",
										:tags_attributes => [{id: 123}, {name: "Kebab"}]
									}} 
		assert_response :forbidden
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end
end
