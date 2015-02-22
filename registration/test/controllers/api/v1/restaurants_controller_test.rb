require 'test_helper'

class Api::V1::RestaurantsControllerTest < ActionController::TestCase

	def setup

		@apiuser = apiusers(:filip)

    	apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
	end

	test "should get list of restaurants" do
		
		get :index, :format => :json
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['restaurants']

		@restaurants = Restaurant::all

		assert_equal body['restaurants'].length, @restaurants.length



		first_restaurant = @restaurants.first
		first_response_restaurant = body['restaurants'].first

		assert_equal first_restaurant.name, first_response_restaurant["name"]
		assert_equal first_restaurant.phone, first_response_restaurant["phone"]
		assert_equal first_restaurant.address, first_response_restaurant["address"]
		assert_equal first_restaurant.description, first_response_restaurant["description"]
		assert_in_delta first_restaurant.longitude, first_response_restaurant["longitude"].to_i
		assert_in_delta first_restaurant.latitude, first_response_restaurant["latitude"].to_i



		first_restaurant_tags = @restaurants.first.tags
		first_response_restaurant_tags = body['restaurants'].first["tags"]

		assert_equal first_restaurant_tags.length, first_response_restaurant_tags.length

		assert_equal first_restaurant_tags.first.name, first_response_restaurant_tags.first["name"]
		assert_equal first_restaurant_tags.last.name, first_response_restaurant_tags.last["name"]



		first_restaurant_apiuser = @restaurants.first.apiuser
		first_response_restaurant_apiuser = body['restaurants'].first["apiuser"]

		assert_equal first_restaurant_apiuser.name, first_response_restaurant_apiuser["name"]
	end


	test "should not get all user info" do
		
		get :index, :format => :json
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['restaurants']

		@restaurants = Restaurant::all

		first_response_restaurant_apiuser = body['restaurants'].first["apiuser"]


		assert first_response_restaurant_apiuser["name"]
		assert_not first_response_restaurant_apiuser["provider"]
		assert_not first_response_restaurant_apiuser["uid"]
		assert_not first_response_restaurant_apiuser["auth_token"]
		assert_not first_response_restaurant_apiuser["token_expires"]
	end



end
