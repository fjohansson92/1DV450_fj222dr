require 'test_helper'

class ApiStatisticTest < ActiveSupport::TestCase

  def setup 
  	user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
	user.save
	apikey = user.apikeys.create(name: "localhost")

  	@apiStatistic = apikey.api_statistics.create
  end

  test "apistatistic should be valid" do
  	assert @apiStatistic.valid?
  	assert_equal @apiStatistic.call, 1
  end

  test "api_call should increase call" do
	assert_difference '@apiStatistic.call', 1 do
		@apiStatistic.api_call
	end
  end

end
