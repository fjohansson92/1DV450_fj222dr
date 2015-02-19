require 'test_helper'

class ApiusersLoginTest < ActionDispatch::IntegrationTest

	test "login and logout should succeed" do
		
		assert_routing "http://www.api.lvh.me:3001/authenticate", { :controller => "api/sessions", :action => "new" }

		get "http://www.api.lvh.me:3001/authenticate?callback=http://www.example.com&user_token=test_token"

		assert_redirected_to "http://www.api.lvh.me:3001/auth/github"
		follow_redirect!

		assert_redirected_to "http://www.api.lvh.me:3001/auth/github/callback"
		follow_redirect!

		apiuser = Apiuser.find_by_user_token("test_token")

		assert_redirected_to "http://www.example.com?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"

		#TODO: Check if user can use protect  methods



		assert_routing "http://www.api.lvh.me:3001/logout", { :controller => "api/sessions", :action => "destroy" }

		delete "http://www.api.lvh.me:3001/logout", {}, { "auth-token" => apiuser.auth_token, "user-token" => apiuser.user_token }

		assert_response :ok		
		#TODO: Check for message

		assert_not apiuser.auth_token
		assert_not apiuser.user_token
		assert_not apiuser.token_expires
	end

end
