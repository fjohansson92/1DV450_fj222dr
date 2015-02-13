require 'test_helper'

class ApikeyTest < ActiveSupport::TestCase

	def setup
		user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
		user.save
		@apikey = user.apikeys.create(name: "localhost")
	end

	test "should be valid apikey" do
		assert @apikey.valid?
	end


	# Apikey revoked tests
	test "revoked should be false default" do
		assert_not @apikey.revoked
	end


	# Apikey name tests
  
  test "name should be required" do
  	@apikey.name = "  "
  	assert_not @apikey.valid?
  end


  test "name should not be to long" do
  	@apikey.name = "a" * 51
  	assert_not @apikey.valid?
  end

end




