require 'test_helper'

class ApiusersLoginTest < ActionDispatch::IntegrationTest

	test "login should succeed" do
		
		assert_routing "http://www.api.lvh.me:3001/authenticate", { :controller => "api/sessions", :action => "new" }

		get "http://www.api.lvh.me:3001/authenticate?callback=http://www.example.com&user_token=test_token"

		assert_redirected_to "http://www.api.lvh.me:3001/auth/github"
		follow_redirect!

		assert_redirected_to "http://www.api.lvh.me:3001/auth/github/callback"
		follow_redirect!

		apiuser = Apiuser.find_by_user_token("test_token")

		assert_redirected_to "http://www.example.com?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"

		#TODO: Check if user can use protect  methods

	end

end
