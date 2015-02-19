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

  test "user_token should not be to long" do
    @apiuser.user_token = "a" * 256
    assert_not @apiuser.valid?
  end

  test "user_token should be unique" do
    @apiuser.update_token "randomstringone"
    duplicate_apiuser = @apiuser.dup
    duplicate_apiuser.user_token = duplicate_apiuser.user_token.upcase
    @apiuser.save
    assert_not duplicate_apiuser.valid?
  end


  test "auth_token, user_token and token_expires should be set" do
  	@apiuser.update_token "randomstringone"
  	assert @apiuser.auth_token
  	first_token = @apiuser.auth_token
  	first_token_expires = @apiuser.token_expires
    first_user_token = @apiuser.user_token

    sleep 0.001

  	@apiuser.update_token "randomstringsecond"
  	assert @apiuser.auth_token
  	assert_not_equal first_token, @apiuser.auth_token 
  	assert_not_equal first_token_expires, @apiuser.token_expires 
    assert_not_equal first_user_token, @apiuser.user_token 

    sleep 0.001


  	assert @apiuser.token_expires < Time.now + 1.hour
  	assert @apiuser.token_expires > Time.now + 50.minute
  end





end
