require 'test_helper'

class RestaurantTest < ActiveSupport::TestCase

	def setup
		user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
		user.save

		@restaurant = user.restaurants.create(name: "Pizzerian", phone: "12346789", address: "Gatan 10, 30303 Kalmar", description: "Säljer pizzor.", latitude: 56.684598, longitude: 16.364136)
	end

	test "should be valid restaurant" do
		assert @restaurant.valid?
	end



	test "name should be required" do
		@restaurant.name = ""
		assert_not @restaurant.valid?
	end

	test "name should not be to long" do
		@restaurant.name = "a" * 50
    	assert_not @restaurant.valid?
	end



	test "phone should be required" do
		@restaurant.phone = ""
		assert_not @restaurant.valid?
	end

	test "phone should not be to long" do
		@restaurant.phone = "a" * 12
    	assert_not @restaurant.valid?
	end



	test "address should be required" do
		@restaurant.address = ""
		assert_not @restaurant.valid?
	end

	test "address should not be to long" do
		@restaurant.address = "a" * 100
    	assert_not @restaurant.valid?
	end



	test "description should be required" do
		@restaurant.description = ""
		assert_not @restaurant.valid?
	end



	test "latitude should be required" do
		@restaurant.latitude = ""
		assert_not @restaurant.valid?
	end

	test "latitude should not be text" do
		@restaurant.latitude = "text"
		assert_not @restaurant.valid?
	end

	test "latitude should not be to high" do
		@restaurant.latitude = 90.0
		assert_not @restaurant.valid?
	end

	test "latitude should not be to low" do
		@restaurant.latitude = -90.0
		assert_not @restaurant.valid?
	end

	test "latitude should round" do
		@restaurant.latitude = 50.0000009
		assert_equal @restaurant.latitude, 50.000001
	end



	test "longitude should be required" do
		@restaurant.longitude = ""
		assert_not @restaurant.valid?
	end

	test "longitude should not be text" do
		@restaurant.longitude = "text"
		assert_not @restaurant.valid?
	end

	test "longitude should not be to high" do
		@restaurant.longitude = 190.0
		assert_not @restaurant.valid?
	end

	test "longitude should not be to low" do
		@restaurant.longitude = -190.0
		assert_not @restaurant.valid?
	end

	test "longitude should round" do
		@restaurant.longitude = 50.0000009
		assert_equal @restaurant.longitude, 50.000001
	end
end
