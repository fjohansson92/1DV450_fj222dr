require 'test_helper'

class ApikeysControllerTest < ActionController::TestCase

	def setup 
		@user = users(:filip)
		@wrong_user = users(:wrong_user)
		@non_admin_user = users(:non_admin_user)

		@apikey = apikeys(:apikey)
		@revoked_apikey = apikeys(:revoked_apikey)

		@domains = @apikey.domains
	end



	# Show apikey tests

	test "should show apikey and domains" do

		log_in_as @non_admin_user

		get :show, {id: @apikey.id, user_id: @non_admin_user.id} 
		assert_response :success

		assert_template :show
		assert_template layout: "layouts/application"

		assert_not_nil assigns(:apikey)
		assert_equal assigns(:apikey), @apikey

		assert_not_nil assigns(:apikey).domains
		assert_equal assigns(:apikey).domains, @domains
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
			post :create, {user_id: @non_admin_user.id, apikey: {name: "localhost"}} 
		end

		assert_redirected_to @non_admin_user
		
		assert_equal "API-nyckeln är registrerad!", flash[:success]
		
	end

	test "should fail to create apikey" do

		log_in_as @non_admin_user

		assert_no_difference 'Apikey.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {name: ""}}
		end

		assert_template :new
		assert assigns(:apikey).errors
	end

	test "should fail to create when not logged in" do

		assert_no_difference 'Apikey.count' do
			post :create, {user_id: @non_admin_user.id, apikey: {name: "localhost"}}
		end

		assert_redirected_to login_path	

	end

	test "should not be able to set revoked or key" do

		log_in_as @non_admin_user

		get :new, {user_id: @non_admin_user.id} 

		name = "localhost"
		key = "own key"

		assert_difference 'Apikey.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey: {name: name, revoked: true, key: key}} 
		end

		apikey = Apikey.order("created_at").last

		assert_equal name, apikey.name
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
		
		name = "google"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: name}} 

		assert_redirected_to user_apikey_path

		assert_equal "Redigeringen av API-nycklen lyckades!", flash[:success]

		@apikey.reload		

		assert_equal @apikey.name, name
	end	

	test "should fail to update apikey" do

		log_in_as @non_admin_user

		get :edit, { id: @apikey.id, user_id: @non_admin_user.id }

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: ""}} 

		assert_template :edit

	  assert assigns(:apikey).errors
	end

	test "should fail to update when not logged in" do

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: "youtube"}} 
		assert_redirected_to login_path		
	end

	test "should fail to update when wrong user" do

		log_in_as @wrong_user

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: "www.youtube"}} 
		assert_redirected_to root_path
	end

	test "should fail to update when revoked" do

		log_in_as @non_admin_user

		name = "google"

		patch :update, {user_id: @non_admin_user.id, id: @revoked_apikey.id, apikey: {name: name, revoked: false }} 

		@revoked_apikey.reload		

		assert_equal "Du kan inte redigerad en ogiltlig API-nyckel!", flash[:danger]

		assert_not_equal @revoked_apikey.name, name
		assert @revoked_apikey.revoked
	end

	test "should fail to update revoked" do

		log_in_as @non_admin_user

		name = "google"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: name, revoked: true}} 

		@apikey.reload		

		assert_equal @apikey.name, name
		assert_not @apikey.revoked
	end

	test "should fail to update key" do

		log_in_as @non_admin_user

		name = "google"
		key = "own key"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: name, key: key}} 

		@apikey.reload		

		assert_equal @apikey.name, name
		assert_not_equal @apikey.key, key
	end

	test "should update everything when admin" do

		log_in_as @user

		name = "google"

		patch :update, {user_id: @non_admin_user.id, id: @apikey.id, apikey: {name: name, revoked: true }} 

		@apikey.reload		

		assert_equal @apikey.name, name
		assert @apikey.revoked

		assert_equal "Redigeringen av API-nycklen lyckades!", flash[:success]
	end




	# Destroy apikey tests
	
	test "should remove apikey" do

		log_in_as @non_admin_user
		

		assert_difference 'Domain.count', -1 do
			assert_difference 'Apikey.count', -1 do
				delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
			end
		end

		assert_redirected_to @non_admin_user

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
		
		assert_equal "Du kan inte redigerad en ogiltlig API-nyckel!", flash[:danger]
	end

	test "should remove revoked apikey when admin" do 

		log_in_as @user
		
		assert_difference 'Apikey.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @revoked_apikey.id}
		end

		assert_redirected_to @non_admin_user

		assert_equal "API-nycklen är borttagen!", flash[:success]
	end

	test "should remove apikey when admin" do 

		log_in_as @user
		
		assert_difference 'Apikey.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, id: @apikey.id}
		end

		assert_redirected_to @non_admin_user

		assert_equal "API-nycklen är borttagen!", flash[:success]
	end

end
