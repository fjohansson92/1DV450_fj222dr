require 'test_helper'

class ApikeyTest < ActiveSupport::TestCase

	def setup
		@apikey = Apikey.new(key: "temprandomstring", domain: "http://localhost:3000")
	end

	test "should be valid default apikey" do
		assert @apikey.valid?
	end


	# Apikey revoked tests
	test "revoked should be false default" do
		assert_not @apikey.revoked
	end



	# Apikey key tests
  
  test "key should be required" do
  	@apikey.key = "  "
  	assert_not @apikey.valid?
  end


  test "key should not be to long" do
  	@apikey.key = "a" * 256
  	assert_not @apikey.valid?
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


  test "domain should be valid" do
  	@apikey.domain = "Not a valid domain"
  	assert_not @apikey.valid?
  end


end




