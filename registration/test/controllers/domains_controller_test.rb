require 'test_helper'

class DomainsControllerTest < ActionController::TestCase

	def setup 
		@user = users(:filip)
		@wrong_user = users(:wrong_user)
		@non_admin_user = users(:non_admin_user)

		@apikey = apikeys(:apikey)
		@revoked_apikey = apikeys(:revoked_apikey)

		@domain = domains(:youtube)
		@domain_revoked_key = domains(:bootstrap)
	end



	# Create domain tests

	test "should create domain" do

		log_in_as @non_admin_user

		assert_difference 'Domain.count', 1 do
			post :create, {user_id: @non_admin_user.id, apikey_id: @apikey.id, domain: {domain: "https://github.com/"}} 
		end

		assert_redirected_to user_apikey_path(@non_admin_user, @apikey)
		
		assert_equal "Domänen är registrerad!", flash[:success]
	end


	test "should fail to create domain" do

		log_in_as @non_admin_user

		assert_no_difference 'Domain.count' do
			post :create, {user_id: @non_admin_user.id, apikey_id: @apikey.id, domain: {domain: ""}} 
		end

		assert assigns(:domain).errors
	end


	test "should fail to create when not logged in" do

		assert_no_difference 'Domain.count' do
			post :create, {user_id: @non_admin_user.id, apikey_id: @apikey.id, domain: {domain: "https://github.com/"}} 
		end

		assert_redirected_to login_path	

	end



	# Destroy domain tests
	
	test "should remove domain" do

		log_in_as @non_admin_user
		
		assert_difference 'Domain.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @apikey.id, id: @domain.id }
		end

		assert_equal "Domänen är borttagen!", flash[:success]
	end


	test "should fail to remove domain when not logged in" do
		assert_no_difference 'Domain.count' do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @apikey.id, id: @domain.id }
		end
		assert_redirected_to login_path	
	end


	test "should fail to remove domain when other user" do

		log_in_as @wrong_user

		assert_no_difference 'Domain.count' do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @apikey.id, id: @domain.id }
		end

		assert_redirected_to root_path	
	end


	test "should fail to remove domain when revoked when not admin" do

		log_in_as @non_admin_user
		
		assert_no_difference 'Domain.count' do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @revoked_apikey.id, id: @domain_revoked_key.id }
		end
		
		assert_equal "Du kan inte redigerad en ogiltlig API-nyckels domäner!", flash[:danger]
	end


	test "should remove revoked domain when admin" do 

		log_in_as @user
		
		assert_difference 'Domain.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @revoked_apikey.id, id: @domain_revoked_key.id }
		end

		assert_equal "Domänen är borttagen!", flash[:success]
	end

	test "should remove domain when admin" do 

		log_in_as @user
		
		assert_difference 'Domain.count', -1 do
			delete :destroy, {user_id: @non_admin_user.id, apikey_id: @apikey.id, id: @domain.id }
		end

		assert_equal "Domänen är borttagen!", flash[:success]
	end

end
