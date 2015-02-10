require 'test_helper'

class UsersLoginTest < ActionDispatch::IntegrationTest

	def setup
		@user = users(:filip)
	end


	test "login and logout should succeed" do

		# Login
		get login_path
		post login_path, session: { email: @user.email, password: 'unencrypted_password'}
		assert_redirected_to @user
		follow_redirect!

		assert_template 'users/show'
		
		assert_select "a[href=?]", logout_path

		assert is_logged_in?



		# Logout
		delete logout_path
		assert_redirected_to login_path
		follow_redirect!

		assert_select "a[href=?]", login_path
		assert_equal "Du är nu utloggad!", flash[:success]

		assert_not is_logged_in?


		# Logout while logged out
		delete logout_path
		assert_redirected_to login_path
		follow_redirect!

		assert_select "a[href=?]", login_path
		assert_equal "Du är nu utloggad!", flash[:success]

		assert_not is_logged_in?
	end

	test "login should fail" do
		get login_path
		assert_template :new
		post login_path, session: { email: "not a user", password: "password"}
		assert_template :new

		assert_not is_logged_in?

		assert_equal 'E-postadressen eller lösenordet du angav är fel.', flash[:danger]
	
	end	

	test "login with remembering user" do
		log_in_as @user
		assert_not_nil cookies['remember_token']
	end

	test "login without remembering user" do
		log_in_as @user, remember_me: '0'
		assert_nil cookies['remember_token']
	end

end
