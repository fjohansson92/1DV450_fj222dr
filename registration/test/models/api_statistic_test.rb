require 'test_helper'

class ApiStatisticTest < ActiveSupport::TestCase

  def setup 
  	user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
	user.save
	apikey = user.apikeys.create(name: "localhost")

  	@api_statistics = apikey.api_statistics.create
  end

  test "apistatistic should be valid" do
  	assert @api_statistics.valid?
  	assert_equal @api_statistics.call, 1
  end

  test "api_call should increase call" do
	assert_difference '@api_statistics.call', 1 do
		@api_statistics.api_call
	end
  end

end
