require 'test_helper'

class ApiuserTest < ActiveSupport::TestCase

  def setup 
  	auth = {'provider' => 'github',
		  			'uid' => '5634563',
		  			'info' => {'name' => '´Filip Johansson'}
    }

		@apiuser = Apiuser.create_with_github_omniauth(auth)
  end

  test "apiuser should be valid" do
  	assert @apiuser.valid?
  end

  test "provider should be required" do
  	@apiuser.provider = ""
  	assert_not @apiuser.valid?
  end

  test "uid should be required" do
  	@apiuser.uid = ""
  	assert_not @apiuser.valid?
  end

  test "name should be required" do
  	@apiuser.name = ""
  	assert_not @apiuser.valid?
  end


  test "auth_token and token_expires should be set" do
  	@apiuser.update_token
  	assert @apiuser.auth_token
  	first_token = @apiuser.auth_token
  	first_token_expires = @apiuser.token_expires

  	@apiuser.update_token
  	assert @apiuser.auth_token
  	assert_not_equal first_token, @apiuser.auth_token 
  	assert_not_equal first_token_expires, @apiuser.token_expires 

  	assert user.token_expires < Time.now + 1.hour
  	assert user.token_expires > Time.now + 50.minute
  end





end
