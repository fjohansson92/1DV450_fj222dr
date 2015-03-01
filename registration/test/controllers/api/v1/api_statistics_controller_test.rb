require 'test_helper'

class Api::V1::ApiStatisticsControllerTest < ActionController::TestCase

	def setup
		apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
	end

	test "should get list of apikeys" do
		
		get :index, {  :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['apikeys']

		apikeys = Apikeys::all

		assert_equal body['links']["self"], api_v1_apikeys_url
		assert_equal body['links']["first"], api_v1_apikeys_url + "?limit=25&offset=0"
		assert_not body['links']["prev"]
		assert_not body['links']["prev"]
		assert_equal body['links']["last"], api_v1_apikeys_url + "?limit=25&offset=0"


		first_apikey = apikeys.first
		first_response_apikey = body['apikeys'].first

		assert_equal first_apikey.id, first_response_apikey["id"]
		assert_equal first_apikey.name, first_response_apikey["name"]

		assert_equal api_v1_apikey_url(first_apikey), first_response_apikey["links"]["self"]

		assert_not first_response_apiuser["key"]
		assert_not first_response_apiuser["revoked"]
		assert_not first_response_apiuser["user_id"]
	end

	test "should show api statistics" do

		apikey = Apikey::find(1)

		get :show, { id: apikey.id, :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert body['apikey']
		assert_equal body['links']["self"], api_v1_apikey_url(apikey)

		assert_equal apikey.id, body['apikey']["id"]
		assert_equal apikey.name, body['apikey']["name"]

		assert_equal api_v1_apikey_url(apikey), body['apikey']["links"]["self"]

		assert_equal 30, body['apikey']['api_statistics'].length
		assert body['apikey']['api_statistics'].first['call']
		assert_equal apikey.id ,body['apikey']['api_statistics'].first['apikey_id']

	end

	test "should get error if apikey not found" do
		
		get :show, {  id: 1000, :format => :json }
		
		assert_response :not_found
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end









	test "should be unauthorized without apikey" do
		request.env['HTTP_AUTHORIZATION'] = nil
		get :index
		assert_response :unauthorized

		get :show, {id: 1}
		assert_response :unauthorized
	end


end
