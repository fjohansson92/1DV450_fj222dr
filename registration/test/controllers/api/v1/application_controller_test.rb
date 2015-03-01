require 'test_helper'

class Api::V1::ApplicationControllerTest < ActionController::TestCase


	def setup
		@controller = Api::V1::SessionsController.new
		@apikey = apikeys(:apikey)
		@revoked_apikey = apikeys(:revoked_apikey)
		@apikey_wrong_domain = apikeys(:wrong_domain)
	end

	test "should be unauthorized without apikey" do

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "1401b"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should be unauthorized with revoked apikey" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@revoked_apikey.key)

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "2101"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should be unauthorized with wrong domain" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey_wrong_domain.key)

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_response :unauthorized
		
		error = JSON.parse(@response.body)
		assert_equal error['errorCode'], "2102"
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "should add call to apikey for today" do

		request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		assert @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.nil?

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 

		assert_equal @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.call, 1

		get :new, {user_token: "randomstring", callback:"http://www.example.com"} 		

		assert_equal @apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first.call, 2
	end



	test "should limit resources" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, limit: 5, order_by_asc: true}
		assert_response :ok

		assert_equal 5, assigns(:restaurants).length

		assert_equal Restaurant::find(1), assigns(:restaurants).first
		assert_equal Restaurant::find(5), assigns(:restaurants).last
	end

	test "text limit should get default" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, limit: "text"}
		assert_response :ok

		assert_equal 25, assigns(:restaurants).length
	end

	test "too high limit should get default" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, limit: 100}
		assert_response :ok

		assert_equal 25, assigns(:restaurants).length
	end

	test "too low limit should get default" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, limit: -100}
		assert_response :ok

		assert_equal 25, assigns(:restaurants).length
	end

	test "should offset resources" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 5, limit: 5, order_by_asc: true}
		assert_response :ok

		assert_equal Restaurant::find(6), assigns(:restaurants).first
		assert_equal Restaurant::find(10), assigns(:restaurants).last
	end

	test "text offset should get default" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: "text", limit: 5, order_by_asc: true}
		assert_response :ok

		assert_equal Restaurant::find(1), assigns(:restaurants).first
		assert_equal Restaurant::find(5), assigns(:restaurants).last
	end

	test "too high offset should get zero restaurants" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 500, limit: 5}
		assert_response :ok

		assert_equal assigns(:restaurants).length, 0
	end

	test "too low offset should get from zero" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: -500, limit: 5, order_by_asc: true}
		assert_response :ok

		assert_equal Restaurant::find(1), assigns(:restaurants).first
		assert_equal Restaurant::find(5), assigns(:restaurants).last
	end



	test "should set relative limit offset values" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 0, limit: 5}
		assert_response :ok


		assert_not assigns(:prev_offset)
		assert_equal 5, assigns(:prev_limit)

		assert_equal 5, assigns(:next_limit)
		assert_equal 5, assigns(:next_offset)
		
		assert_equal Restaurant::all.length - 5, assigns(:last_offset)
	end

	test "prev limit should be smaller then limit and offset zero" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 3, limit: 5}
		assert_response :ok

		assert_equal 0, assigns(:prev_offset)
		assert_equal 3, assigns(:prev_limit)

		assert_equal 5, assigns(:next_limit)
		assert_equal 8, assigns(:next_offset)
	end

	test "prev limit should be same as limit" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 10, limit: 5}
		assert_response :ok

		assert_equal 5, assigns(:prev_offset)
		assert_equal 5, assigns(:prev_limit)

		assert_equal 5, assigns(:next_limit)
		assert_equal 15, assigns(:next_offset)
	end

	test "next should be nil" do

		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)

		get :index, { format: :json, offset: 36, limit: 5}
		assert_response :ok

		assert_equal 31, assigns(:prev_offset)
		assert_equal 5, assigns(:prev_limit)

		assert_equal 5, assigns(:next_limit)
		assert_not assigns(:next_offset)
	end

	test "should search single string" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "pizzerian"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 2

    	assert_equal restaurants(:restaurant), assigns(:restaurants).first
    	assert_equal restaurants(:restaurant_to_remove), assigns(:restaurants).last
	end

	test "should search multiple strings in multiple columns" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "pizzerian+kebab+kalmar"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:restaurant), assigns(:restaurants).first
	end

	test "should search single string in apiuser" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "john"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:search1), assigns(:restaurants).first
	end

	test "should search multiple strings and one in apiuser" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "filip+search2+växjö"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:search2), assigns(:restaurants).first
	end

	test "should search single string in tag" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "cafe"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:search2), assigns(:restaurants).first
	end

	test "should search multiple strings in different tags" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "cafe+sushi"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:search2), assigns(:restaurants).first
	end

	test "should search multiple strings values from all tables" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "john+search1+pizza"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 1

    	assert_equal restaurants(:search1), assigns(:restaurants).first
	end

	test "should search where no restaurant match" do
		@controller = Api::V1::RestaurantsController.new
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(@apikey.key)
    	get :index, { format: :json, q: "john+search1+pizza+somethingsomething"}
    	assert_response :ok

    	body = JSON.parse(@response.body)

    	assert_equal body['restaurants'].length, 0
	end
end
