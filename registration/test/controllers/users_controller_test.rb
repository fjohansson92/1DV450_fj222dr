require 'test_helper'

class UsersControllerTest < ActionController::TestCase


	# Index user tests

	test "should list all users" do
		get :index
		assert_response :success

		assert_template :index
  	assert_template layout: "layouts/application"

  	assert_select "#users" do 
		  assert_select "li", 52
		end
  	
		#TODO test that user is admin  	

	end



	# Show user tests

	test "should show user" do
		get :show, {id: 1} 
		assert_response :success

		assert_template :show
  	assert_template layout: "layouts/application"

  	assert_not_nil assigns(:user)
  	assert_equal assigns(:user), users(:filip)
	end



	# New user tests
 
	test "should get new" do
		get :new
		assert_response :success

		assert_template :new
  	assert_template layout: "layouts/application"

  	#TODO assert_select 'title', "Registrering"
	end

	test "should route to user form" do
		assert_recognizes({controller: 'users', action: 'new'}, '/signup')
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

		#TODO: assert_equal "Du är nu registrerad!", flash[:success]
	end


	test "should fail to create user" do
		get :new
		assert_no_difference 'User.count' do
			post :create, user: {email: "",name: "Foo Bar", password: "Password", password_confirmation: "Password"} 
		end

		assert_template :new
		assert_select '#user_errors'
		assert_select '#user_errors li'
	end



	# Destroy user tests
	
	test "should remove user" do

		#TODO: Log in as admin
		#Test if autherized
		
		assert_difference 'User.count', -1 do
			delete user_path(users(:baduser))
		end



	end
	
end
