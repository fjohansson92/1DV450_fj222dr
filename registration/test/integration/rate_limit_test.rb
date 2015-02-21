require 'test_helper'

class RateLimitTest < ActionDispatch::IntegrationTest


	test "test rate limit" do

		REDIS.flushall

		@apikey = apikeys(:apikey)

		get "http://www.api.lvh.me:3001/v1/test", nil, :authorization => %{Token token="#{@apikey.key}"}
		
		assert_equal response.headers["X-Rate-Limit-Remaining"].to_i, 59
		
		assert_equal response.headers["X-Rate-Limit-Limit"].to_i, 60
		
		assert response.headers["X-Rate-Limit-Reset"].to_i
		 
		for i in 0..58 
			get "http://www.api.lvh.me:3001/v1/test", nil, :authorization => %{Token token="#{@apikey.key}"}
			assert_response :ok	
			i
		end

		get "http://www.api.lvh.me:3001/v1/test", nil, :authorization => %{Token token="#{@apikey.key}"}
		
		assert_response :too_many_requests
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "1429"
		assert error['developerMessage']
		assert error['userMessage']

		REDIS.flushall
	end



end
