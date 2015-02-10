require 'test_helper'

class ApikeysControllerTest < ActionController::TestCase

	def setup 
		@user = users(:filip)
		@wrong_user = users(:wrong_user)
		@non_admin_user = users(:non_admin_user)

		@apikey = apikeys(:apikey)
		@revoked_apikey = apikeys(:revoked_apikey)
	end



	# Index apikeys tests

	test "should list all apikeys for user" do

		log_in_as @non_admin_user

		get :index, user_id: @non_admin_user.id
		assert_response :success

		assert_template :index
  	assert_template layout: "layouts/application"

	end

	test "should fail to list apikeys when not logged in" do
		get :index, user_id: @non_admin_user.id
		assert_redirected_to login_path	
	end


	test "should fail to list users when not admin" do

		log_in_as @wrong_user

		get :index, user_id: @non_admin_user.id
		assert_redirected_to root_path	
	end

	test "should list all apikeys for admin" do

		log_in_as @user

		get :index, user_id: @non_admin_user.id
		assert_response :success
	end




	# Show apikey tests

	test "should show user" do

		log_in_as @non_admin_user

		get :show, {id: @apikey.id, user_id: @non_admin_user.id} 
		assert_response :success

		assert_template :show
	  assert_template layout: "layouts/application"

	  assert_not_nil assigns(:apikey)
	  assert_equal assigns(:apikey), @apikey
	end

	test "should fail to show when not logged in" do
		get :show, {id: @apikey.id, user_id: @non_admin_user.id} 
		assert_redirected_to login_path		
	end

	test "should fail to show when wrong user" do
		log_in_as @non_admin_user
		get :show, {id: @apikey.id, user_id: @wrong_user.id }
		assert_redirected_to root_path	
	end

	test "should show apikey when admin" do 

		log_in_as @user

		get :show, {id: @apikey.id, user_id: @non_admin_user.id} 
		assert_response :success
	end




	# New apikey tests
 
	test "should get new" do
		get :new, {user_id: @non_admin_user.id} 
		assert_response :success

		assert_template :new
  	assert_template layout: "layouts/application"
	end




	# Create apikey tests

	test "should create user" do

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 
		assert_difference 'User.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: "http://localhost:3000"}} 
		end

		#TODO: assert_redirected_to ?
	end

	test "should fail to create user" do

		log_in_as @non_admin_user

		get :new
		assert_no_difference 'User.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: ""}}
		end

		assert_template :new
	end

	test "should fail to create when not logged in" do

		assert_no_difference 'User.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: "http://localhost:3000"}}
		end

		assert_redirected_to login_path	

	end

	test "should not be able to set revoked or key" do

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 

		domain = "http://localhost:3000"
		key = "own key"

		assert_difference 'User.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: domain, revoked: true, key: key}} 
		end

		apikey = Apikey.find_by_domain(domain)

		assert_equal domain, apikey.domain
		assert_not_equal key, apikey.key
		assert_not revoked
	end




	# Edit apikey tests

	test "should get edit" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }
		assert_response :success

		assert_template :edit
  	assert_template layout: "layouts/application"
	end

	test "should fail to edit when not logged in" do
		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }

		assert_redirected_to login_path		
	end

	test "should fail to edit when wrong user" do

		log_in_as @wrong_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }

		assert_redirected_to root_path	
	end

	test "should get edit when admin" do 

		log_in_as @user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }
		assert_response :success
	end




	# Update apikey tests
	
	test "should update user" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }
		
		domain = "https://www.youtube.com/"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain}} 

		#TODO Assert redirect to index

		#TODO: Check for message

		@apikey.reload		

		assert_equal @apikey.domain, domain
	end	

	test "should fail to update user" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: ""}} 

		assert_template :edit

	  #TODO: check for message
	end

	test "should fail to update when not logged in" do

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: "https://www.youtube.com/"}} 
		#TODO: Check for message
		assert_redirected_to login_path		
	end

	test "should fail to update when wrong user" do

		log_in_as @wrong_user

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: "https://www.youtube.com/"}} 
		#TODO: Check for message
		assert_redirected_to root_path
	end

	test "should fail to update when revoked" do

		log_in_as @non_admin_user

		domain = "https://www.youtube.com/"

		patch :update, {user_id: @non_admin_user.id, id: @revoked_apikey.id, apikey: {domain: domain, revoked: false }} 

		@revoked_apikey.reload		

		assert_not_equal @revoked_apikey.domain, domain
		assert @revoked_apikey.revoked
	end

	test "should fail to update revoked" do

		log_in_as @non_admin_user

		domain = "https://www.youtube.com/"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, revoked: true}} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert_not @apikey.revoked
	end

	test "should fail to update key" do

		log_in_as @non_admin_user

		domain = "https://www.youtube.com/"
		key = "own key"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, key: key}} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert_not_equal @apikey.key, key
	end

	test "should update everything when admin" do

		log_in_as @user

		domain = "https://www.youtube.com/"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, revoked: true }} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert @apikey.revoked
	end




	# Destroy apikey tests
	
	test "should remove apikey" do

		log_in_as @non_admin_user
		
		assert_difference 'User.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		#TODO: Assert redirect to index

		#TODO: assert message
	end

	test "should fail to remove apikey when not logged in" do
		assert_no_difference 'User.count' do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end
		assert_redirected_to login_path	
	end

	test "should fail to remove apikey when other user" do

		log_in_as @wrong_user

		assert_no_difference 'User.count' do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		assert_redirected_to root_path	
	end

	test "should remove apikey when admin" do 

		log_in_as @user
		
		assert_difference 'User.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		#TODO: Assert redirect to index

		#TODO: assert message
	end

end
