require 'test_helper'

class Api::V1::PositionsControllerTest < ActionController::TestCase

	def setup
		apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
	end

	test "should get restaurants" do

		get :index, {  :format => :json, lng: 49, lat: 49 }
		assert_response :ok

		body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 2
	end

	test "should get restaurants negativ lat and lng" do

		get :index, {  :format => :json, lng: -11, lat: -22 }
		assert_response :ok

		body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1
	end

	test "should partial only name" do
		get :index, {  filter: "name", :format => :json, lng: -11, lat: -22 }
		assert_response :ok

		body = JSON.parse(@response.body)
		restaurant = restaurants(:search2)

		assert_equal body['restaurants'].first, { "name" => restaurant.name }
	end

	test "should get restaurant if lng is over or under 4" do
		get :index, {  :format => :json, lng: -15, lat: -22 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 1

    	get :index, {  :format => :json, lng: -7, lat: -22 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 1
	end

	test "should not get restaurant if lng is over or under 5" do
		get :index, {  :format => :json, lng: -16, lat: -22 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 0

    	get :index, {  :format => :json, lng: -6, lat: -22 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 0
	end

	test "should get restaurant if lat is over or under 2" do
		get :index, {  :format => :json, lng: -11, lat: - 24}
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 1

    	get :index, {  :format => :json, lng: -11, lat: -20 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 1
	end

	test "should not get restaurant if lat is over or under 3" do
		get :index, {  :format => :json, lng: -11, lat: -25 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 0

    	get :index, {  :format => :json, lng: -11, lat: -19 }
		assert_response :ok
		body = JSON.parse(@response.body)
    	assert_equal body['restaurants'].length, 0
	end

	test "should not get any restaurants" do

		get :index, {  :format => :json, lng: -110, lat: -220 }
		assert_response :ok

		body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 0
	end

	test "should get error message if lng is missing" do

		get :index, {  :format => :json, lat: -220 }
		assert_response :bad_request

		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should get error message if lng is text" do

		get :index, {  :format => :json, lng: "text", lat: -220 }
		assert_response :bad_request

		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should get error message if lat is missing" do

		get :index, {  :format => :json, lng: -220 }
		assert_response :bad_request

		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should get error message if lat is text" do

		get :index, {  :format => :json, lng: 50, lat: "text" }
		assert_response :bad_request

		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end
end
