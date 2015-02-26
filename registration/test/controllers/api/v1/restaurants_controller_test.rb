require 'test_helper'

class Api::V1::RestaurantsControllerTest < ActionController::TestCase

	def setup

		@apiuser = apiusers(:filip)

    	apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
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
		assert_equal body['links']["last"], api_v1_restaurants_url + "?limit=25&offset=6"



		first_restaurant = @restaurants.first
		first_response_restaurant = body['restaurants'].first

		assert_equal first_restaurant.name, first_response_restaurant["name"]
		assert_equal first_restaurant.phone, first_response_restaurant["phone"]
		assert_equal first_restaurant.address, first_response_restaurant["address"]
		assert_equal first_restaurant.description, first_response_restaurant["description"]
		assert_in_delta first_restaurant.longitude, first_response_restaurant["longitude"].to_i
		assert_in_delta first_restaurant.latitude, first_response_restaurant["latitude"].to_i
		assert_equal api_v1_restaurant_url(first_restaurant), first_response_restaurant["links"]["self"]



		first_restaurant_tags = @restaurants.first.tags
		first_response_restaurant_tags = body['restaurants'].first["tags"]

		assert_equal first_restaurant_tags.length, first_response_restaurant_tags.length

		assert_equal first_restaurant_tags.first.name, first_response_restaurant_tags.first["name"]
		assert_equal api_v1_tag_url(first_restaurant_tags.first), first_response_restaurant_tags.first["links"]["self"]
		assert_equal api_v1_tag_restaurants_url(first_restaurant_tags.first), first_response_restaurant_tags.first["links"]["restaurants"]

		assert_equal first_restaurant_tags.last.name, first_response_restaurant_tags.last["name"]



		first_restaurant_apiuser = @restaurants.first.apiuser
		first_response_restaurant_apiuser = body['restaurants'].first["apiuser"]

		assert_equal first_restaurant_apiuser.name, first_response_restaurant_apiuser["name"]
		assert_equal api_v1_apiuser_url(first_restaurant_apiuser), first_response_restaurant_apiuser["links"]["self"]
		assert_equal api_v1_apiuser_restaurants_url(first_restaurant_apiuser), first_response_restaurant_apiuser["links"]["restaurants"]
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



	test "should gett error if filter is wrong format" do
		get :index, {  filter: "apiuser(error,)", :format => :json }
		
		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end



end
