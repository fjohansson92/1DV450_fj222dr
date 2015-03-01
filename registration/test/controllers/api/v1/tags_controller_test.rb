require 'test_helper'

class Api::V1::TagsControllerTest < ActionController::TestCase

	def setup
		apikey = apikeys(:apikey)
    	request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Token.encode_credentials(apikey.key)
	end

	test "should get list of tags" do
		
		get :index, {  :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)
		assert body['tags']

		tags = Tag::all

		assert_equal body['tags'].length, 25

		assert_equal body['links']["self"], api_v1_tags_url
		assert_equal body['links']["first"], api_v1_tags_url + "?limit=25&offset=0"
		assert_not body['links']["prev"]
		assert_equal body['links']["next"], api_v1_tags_url + "?limit=25&offset=25"
		assert_equal body['links']["last"], api_v1_tags_url + "?limit=25&offset=11"


		first_tag = tags.first
		first_response_tag = body['tags'].first

		assert_equal first_tag.id, first_response_tag["id"]
		assert_equal first_tag.name, first_response_tag["name"]

		assert_equal api_v1_tag_url(first_tag), first_response_tag["links"]["self"]
		assert_equal api_v1_tag_restaurants_url(first_tag), first_response_tag["links"]["restaurants"]
	end

	test "should partial only name" do
		get :index, {  filter: "name", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		tag = Tag::all.first
		assert_equal body['tags'].first, { "name" => tag.name }
	end

	test "should partial multiple attributes" do
		get :index, {  filter: "id,links", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		tag = Tag::all.first

		assert_equal tag.id, body['tags'].first['id']
		assert_equal api_v1_tag_url(tag), body['tags'].first["links"]["self"]
		assert_equal api_v1_tag_restaurants_url(tag), body['tags'].first["links"]["restaurants"]

		assert_not body['tags'].first['name']
	end






	test "should show tag" do

		tag = Tag::find(1)

		get :show, { id: tag.id, :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert body['tag']
		assert_equal body['links']["self"], api_v1_tag_url(tag)


		assert_equal tag.id, body['tag']["id"]
		assert_equal tag.name, body['tag']["name"]

		assert_equal api_v1_tag_url(tag), body['tag']["links"]["self"]
		assert_equal api_v1_tag_restaurants_url(tag), body['tag']["links"]["restaurants"]
	end

	test "should get error if tag not found" do
		get :show, {  id: 1000, :format => :json }
		
		assert_response :not_found
		error = JSON.parse(@response.body)
		assert error['developerMessage']
		assert error['userMessage']
	end

	test "partial should work with single tag too" do

		tag = Tag::find(1)

		get :show, { id: tag.id, filter: "id,name", :format => :json }
		assert_response :ok

		body = JSON.parse(@response.body)

		assert_equal ({ "id" => tag.id, 
						"name" => tag.name
						 }), body['tag']
	end


	test "should be unauthorized without apikey" do
		request.env['HTTP_AUTHORIZATION'] = nil
		get :index
		assert_response :unauthorized

		get :show, {id: 1}
		assert_response :unauthorized
	end

end
