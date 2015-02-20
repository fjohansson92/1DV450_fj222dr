require 'test_helper'

class ApiusersLoginTest < ActionDispatch::IntegrationTest

	test "login and logout should succeed" do

		apikey = apikeys(:apikey)
		
		assert_routing "http://www.api.lvh.me:3001/v1/authenticate", { :controller => "api/v1/sessions", :action => "new" }

		get "http://www.api.lvh.me:3001/v1/authenticate?callback=http://www.example.com&user_token=test_token", nil, :authorization => %{Token token="#{apikey.key}"}

		assert_redirected_to "http://www.api.lvh.me:3001/v1/auth/github"
		follow_redirect!

		assert_redirected_to "http://www.api.lvh.me:3001/v1/auth/github/callback"
		follow_redirect!

		apiuser = Apiuser.find_by_user_token("test_token")

		assert_redirected_to "http://www.example.com?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"

		delete "http://www.api.lvh.me:3001/v1/logout", {}, { "auth-token" => apiuser.auth_token, "user-token" => apiuser.user_token, :authorization => %{Token token="#{apikey.key}"} }

		assert_response :ok		
		message = JSON.parse(@response.body)
		assert message['message']

		apiuser.reload

		assert_not apiuser.auth_token
		assert_not apiuser.user_token
		assert_not apiuser.token_expires
	end

end
