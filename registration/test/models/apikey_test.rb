require 'test_helper'

class ApikeyTest < ActiveSupport::TestCase

	def setup
		user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
		user.save
		@apikey = user.apikeys.create(domain: "http://localhost:3000")
	end

	test "should be valid apikey" do
		assert @apikey.valid?
	end


	# Apikey revoked tests
	test "revoked should be false default" do
		assert_not @apikey.revoked
	end


	# Apikey domain tests
  
  test "domain should be required" do
  	@apikey.domain = "  "
  	assert_not @apikey.valid?
  end


  test "domain should not be to long" do
  	@apikey.domain = "a" * 256
  	assert_not @apikey.valid?
  end


  test "domain should not be valid" do
  	@apikey.domain = "Not a valid domain"
  	assert_not @apikey.valid?
  end

  test "domain should be unique" do 
  	duplicate_apikey = @apikey.dup
  	duplicate_apikey.domain = duplicate_apikey.domain.upcase
  	@apikey.save
  	assert_not duplicate_apikey.valid?
  end

end




