require 'test_helper'

class Api::V1::ApplicationControllerTest < ActionController::TestCase


	def setup
		@controller = Api::V1::SessionsController.new
		@apikey = apikeys(:apikey)
		@revoked_apikey = apikeys(:revoked_apikey)
		@apikey_wrong_domain = apikeys(:wrong_domain)
	end

	test "should be unauthorized without apikey" do

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "1401b"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should be unauthorized with revoked apikey" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@revoked_apikey.key)

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "2101"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should be unauthorized with wrong domain" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey_wrong_domain.key)

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "2102"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should add call to apikey for today" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		assert @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.nil?

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_equal @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.call, 1

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 		

		assert_equal @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.call, 2
	end

end
