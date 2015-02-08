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

		user = User.find_by_email("a@b.c")
		assert_redirected_to user
		
		
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



	# Edit user tests

	test "should get edit" do
		get :edit, {id: users(:filip).id}
		assert_response :success

		assert_template :edit
  	assert_template layout: "layouts/application"
	end


	
	# Update user tests
	
	test "should update user" do

		user = users(:filip)

		get :edit, {id: user.id}
		
		email = "new@mail.com"
		name = "new name"


		patch	:update, {id: user.id, user: {id: user.id, email: email, name: name }} 

		assert_redirected_to user

		#TODO: Check for message

		user.reload		

		assert_equal user.email, email
		assert_equal user.name,  name

		patch	:update, {id: user.id, user: { email: email, name: name, password: "NewPassword", password_confirmation: "NewPassword" }}

		assert_redirected_to user

		#TODO: Check for message

	end	

	test "should fail to update user" do

		user = users(:filip)

		get :edit, {id: user.id}

		patch	:update, {id: user.id, user: {id: user.id, email: "", name: "Namn", }} 

		assert_template :edit
  	assert_template layout: "layouts/application"

  	#TODO: check for message
	end
	 



	# Destroy user tests
	
	test "should remove user" do

		#TODO: Log in as admin
		#Test if autherized
		
		assert_difference 'User.count', -1 do
			delete :destroy, {id: users(:baduser).id}
		end

		assert_redirected_to users_path

		#TODO: assert message

	end
	
end
