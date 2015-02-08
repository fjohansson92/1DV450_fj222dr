require 'test_helper'

class SessionsControllerTest < ActionController::TestCase

	# New login tests
 
	test "should get new" do
		get :new
		assert_response :success

		assert_template :new
  		assert_template layout: "layouts/application"
	end
end
