require 'test_helper'

class Api::V1::ApiusersControllerTest < ActionController::TestCase


	def setup
		apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
	end

	test "should get list of apiusers" do
		
		get :index, {  :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['apiusers']

		apiusers = Apiuser::all

		assert_equal body['apiusers'].length, 25

		assert_equal body['links']["self"], api_v1_apiusers_url
		assert_equal body['links']["first"], api_v1_apiusers_url + "?limit=25&offset=0"
		assert_not body['links']["prev"]
		assert_equal body['links']["next"], api_v1_apiusers_url + "?limit=25&offset=25"
		assert_equal body['links']["last"], api_v1_apiusers_url + "?limit=25&offset=6"


		first_apiuser = apiusers.first
		first_response_apiuser = body['apiusers'].first

		assert_equal first_apiuser.id, first_response_apiuser["id"]
		assert_equal first_apiuser.name, first_response_apiuser["name"]

		assert_equal api_v1_apiuser_url(first_apiuser), first_response_apiuser["links"]["self"]
		assert_equal api_v1_apiuser_restaurants_url(first_apiuser), first_response_apiuser["links"]["restaurants"]


		assert_not first_response_apiuser["provider"]
		assert_not first_response_apiuser["uid"]
		assert_not first_response_apiuser["auth_token"]
		assert_not first_response_apiuser["token_expires"]
	end

	test "should partial only name" do
		get :index, {  filter: "name", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		apiuser = Apiuser::all.first
		assert_equal body['apiusers'].first, { "name" => apiuser.name }
	end

	test "should partial multiple attributes" do
		get :index, {  filter: "id,links", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		apiuser = Apiuser::all.first

		assert_equal apiuser.id, body['apiusers'].first['id']
		assert_equal api_v1_apiuser_url(apiuser), body['apiusers'].first["links"]["self"]
		assert_equal api_v1_apiuser_restaurants_url(apiuser), body['apiusers'].first["links"]["restaurants"]

		assert_not body['apiusers'].first['name']
	end




	test "should show apiuser" do

		apiuser = Apiuser::find(1)

		get :show, { id: apiuser.id, :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert body['apiuser']
		assert_equal body['links']["self"], api_v1_apiuser_url(apiuser)


		assert_equal apiuser.id, body['apiuser']["id"]
		assert_equal apiuser.name, body['apiuser']["name"]

		assert_equal api_v1_apiuser_url(apiuser), body['apiuser']["links"]["self"]
		assert_equal api_v1_apiuser_restaurants_url(apiuser), body['apiuser']["links"]["restaurants"]

	end

	test "should get error if apiuser not found" do
		get :show, {  id: 1000, :format => :json }
		
		assert_response :not_found
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "partial should work with single apiuser too" do

		apiuser = Apiuser::find(1)

		get :show, { id: apiuser.id, filter: "id,name", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert_equal ({ "id" => apiuser.id, 
						"name" => apiuser.name
						 }), body['apiuser']
	end


end
