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

	test "should show apikey" do

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

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 
		assert_response :success

		assert_template :new
  	assert_template layout: "layouts/application"
	end




	# Create apikey tests

	test "should create apikey" do

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 
		assert_difference 'Apikey.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: "http://localhost:3000"}} 
		end

		assert_redirected_to user_apikeys_path
		
		assert_equal "API-nyckeln är registrerad!", flash[:success]
		
	end

	test "should fail to create apikey" do

		log_in_as @non_admin_user

		assert_no_difference 'Apikey.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: ""}}
		end

		assert_template :new
		assert assigns(:apikey).errors
	end

	test "should fail to create when not logged in" do

		assert_no_difference 'Apikey.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: "http://localhost:3000"}}
		end

		assert_redirected_to login_path	

	end

	test "should not be able to set revoked or key" do

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 

		domain = "http://localhost:3000"
		key = "own key"

		assert_difference 'Apikey.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey: {domain: domain, revoked: true, key: key}} 
		end

		apikey = Apikey.find_by_domain(domain)

		assert_equal domain, apikey.domain
		assert_not_equal key, apikey.key
		assert_not apikey.revoked
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
	
	test "should update apikey" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }
		
		domain = "https://www.youtube.com/"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain}} 

		assert_redirected_to user_apikey_path

		assert_equal "Redigeringen av API-nycklen lyckades!", flash[:success]

		@apikey.reload		

		assert_equal @apikey.domain, domain
	end	

	test "should fail to update apikey" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: ""}} 

		assert_template :edit

	  assert assigns(:apikey).errors
	end

	test "should fail to update when not logged in" do

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: "https://www.youtube.com/"}} 
		assert_redirected_to login_path		
	end

	test "should fail to update when wrong user" do

		log_in_as @wrong_user

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: "https://www.youtube.com/"}} 
		assert_redirected_to root_path
	end

	test "should fail to update when revoked" do

		log_in_as @non_admin_user

		domain = "https://www.google.se"

		patch :update, {user_id: @non_admin_user.id, id: @revoked_apikey.id, apikey: {domain: domain, revoked: false }} 

		@revoked_apikey.reload		

		assert_equal "Du kan inte redigerad en ogiltlig API-nyckel!", flash[:error]

		assert_not_equal @revoked_apikey.domain, domain
		assert @revoked_apikey.revoked
	end

	test "should fail to update revoked" do

		log_in_as @non_admin_user

		domain = "https://www.google.se"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, revoked: true}} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert_not @apikey.revoked
	end

	test "should fail to update key" do

		log_in_as @non_admin_user

		domain = "https://www.google.se"
		key = "own key"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, key: key}} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert_not_equal @apikey.key, key
	end

	test "should update everything when admin" do

		log_in_as @user

		domain = "https://www.google.se"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {domain: domain, revoked: true }} 

		@apikey.reload		

		assert_equal @apikey.domain, domain
		assert @apikey.revoked

		assert_equal "Redigeringen av API-nycklen lyckades!", flash[:success]
	end




	# Destroy apikey tests
	
	test "should remove apikey" do

		log_in_as @non_admin_user
		
		assert_difference 'Apikey.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		assert_redirected_to user_apikeys_path

		assert_equal "API-nycklen är borttagen!", flash[:success]
	end

	test "should fail to remove apikey when not logged in" do
		assert_no_difference 'Apikey.count' do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end
		assert_redirected_to login_path	
	end

	test "should fail to remove apikey when other user" do

		log_in_as @wrong_user

		assert_no_difference 'Apikey.count' do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		assert_redirected_to root_path	
	end

	test "should fail to remove apikey when revoked when not admin" do

		log_in_as @non_admin_user
		
		assert_no_difference 'Apikey.count' do
			delete :destroy, {user_id: @non_admin_user.id, id: @revoked_apikey.id}
		end

		assert_redirected_to user_apikeys_path
		
		assert_equal "Du kan inte redigerad en ogiltlig API-nyckel!", flash[:error]
	end

	test "should remove revoked apikey when admin" do 

		log_in_as @user
		
		assert_difference 'Apikey.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @revoked_apikey.id}
		end

		assert_redirected_to user_apikeys_path

		assert_equal "API-nycklen är borttagen!", flash[:success]
	end

	test "should remove apikey when admin" do 

		log_in_as @user
		
		assert_difference 'Apikey.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		assert_redirected_to user_apikeys_path

		assert_equal "API-nycklen är borttagen!", flash[:success]
	end

end
