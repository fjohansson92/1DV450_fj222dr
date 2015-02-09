require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest

	test "login and logout should succeed" do

		# Login

		user = users(:filip)

		get login_path
		post login_path, session: { email: user.email, password: 'unencrypted_password'}
		assert_redirected_to user
		follow_redirect!

		assert_template 'users/show'
		#TODO: Check for message
		
		assert_select "a[href=?]", logout_path

		assert is_logged_in?

		# Logout
		delete logout_path
		assert_redirected_to login_path
		follow_redirect!

		assert_select "a[href=?]", login_path

		#TODO: Check for message

		assert_not is_logged_in?
	end

	test "login should fail" do
		get login_path
		assert_template :new
		post login_path, session: { email: "not a user", password: "password"}
		assert_template :new

		assert_not is_logged_in?

		#TODO: Check for message
		
		#TODO: Get some page
		
		#TODO: Check message removed 
	
	end	



end
