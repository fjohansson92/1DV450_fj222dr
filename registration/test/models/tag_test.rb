require 'test_helper'

class TagTest < ActiveSupport::TestCase

	def setup

		@tag = Tag.create(name: "Pizzeria")
	end

	test "should be valid tag" do
		assert @tag.valid?
	end

	test "name should be required" do
		@tag.name = ""
		assert_not @tag.valid?
	end

	test "name should not be to long" do
		@tag.name = "a" * 51
    	assert_not @tag.valid?
	end
end
