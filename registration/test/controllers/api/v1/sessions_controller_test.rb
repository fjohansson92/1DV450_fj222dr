require 'test_helper'

class Api::V1::SessionsControllerTest < ActionController::TestCase

	def setup

		@apiuser = apiusers(:filip)
    	request.env["omniauth.auth"] = OmniAuth::AuthHash.new({:provider => @apiuser.provider,
															   :uid => @apiuser.uid,
															   :info => { :name => @apiuser.name}
															})

    	apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)

	end

 	test "new should redirect" do
 		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 
 		assert_redirected_to "http://test.host/v1/auth/github"
 	end

 	test "new should fail to redirect without user_token or callback" do 
		get :new

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "new should fail to redirect without callback" do
		get :new, {user_token: "randomstring"} 

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "new should fail to redirect without user_token" do 
		get :new, {callback: "http://www.example.com"} 

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "new should fail to redirect with same user_token" do
		get :new, {callback:"http://www.example.com", user_token: @apiuser.user_token}

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end







	test "should login registred user" do
		@request.session[:client_callback] = "http://www.example.com"
		@request.session[:user_token] = "egrgergergerger"

		get :create, { provider: 'github' }

		apiuser = Apiuser.find_by_user_token("egrgergergerger")

		assert_redirected_to "http://www.example.com?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"

	end

	test "should fail to create withouth omniauth.auth" do 

		@request.session[:client_callback] = "http://www.example.com"
		@request.session[:user_token] = "egrgergergerger"

		request.env["omniauth.auth"] = nil

		get :create, { provider: 'github' }

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to create without user_token session" do
		@request.session[:client_callback] = "http://www.example.com"

		get :create, { provider: 'github' }

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to create without client_callback session" do
		@request.session[:user_token] = "egrgergergerger"

		get :create, { provider: 'github' }

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to create if apiuser is invalid" do
		request.env["omniauth.auth"] = OmniAuth::AuthHash.new({:provider => @apiuser.provider,
													  		   :uid => "123123123",
													  		   :info => {}
													})

		@request.session[:client_callback] = "http://www.example.com"
		@request.session[:user_token] = "egrgergergerger"

		get :create, { provider: 'github' }

		assert_response :bad_request
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end





	test "should fail to logout without tokens" do

		delete :destroy

		assert_response :unauthorized
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to logout without auth_token" do

		delete :destroy, {}, { "user-token" => @apiuser.user_token }

		assert_response :unauthorized
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should fail to logout without user_token" do

		delete :destroy, {}, { "auth-token" => @apiuser.auth_token }

		assert_response :unauthorized
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end


end

