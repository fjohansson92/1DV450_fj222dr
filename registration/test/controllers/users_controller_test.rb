require 'test_helper'

class UsersControllerTest < ActionController::TestCase






	# New user tests

	test "should get new" do
		get :new
		assert_response :success

		assert_template :new
  	assert_template layout: "layouts/application"

  	assert_select 'title', "Registrering"
	end

	test "should route to user form" do
		assert_routing 'signup', { controller: users, action: 'new'}
	end



	# Create user tests

	test "should create user" do
		get :new
		assert_difference 'User.count', 1 do
			post :create, user: {email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password"} 
		end

		#TODO: Update test with template
		#assert_template 
		
		
		#TODO: Update test check if logged in

		assert_equal flash[:success], "Du är nu registrerad!"
	end


	test "should fail to create user" do
		get :new
		assert_no_difference 'User.count' do
			post :create, user: {email: "",name: "Foo Bar", password: "Password", password_confirmation: "Password"} 
		end

		assert_template :new
		assert_equal flash[:error], "Email saknas" #TODO: Update error message
	end



end
