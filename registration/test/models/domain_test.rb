require 'test_helper'

class DomainTest < ActiveSupport::TestCase

	def setup
		user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
		user.save
		apikey = user.apikeys.create(name: "localhost")
		@domain = apikey.domains.create(domain: "https://www.youtube.com")
	end


	# Domain tests
	test "should be valid domain" do
		assert @domain.valid?
	end

	test "domain should be required" do
		@domain.domain = " "
		assert_not @domain.valid?
	end

	test "domain should not be to long" do
		@domain.domain = "a" * 256
		assert_not @domain.valid?
	end

	test "domain should not be valid" do
		@domain.domain = "Not a valid domain"
		assert_not @domain.valid?
	end

	test "domain should be unique" do
		duplicate_domain = @domain.dup
		duplicate_domain.domain = duplicate_domain.domain.upcase
		@domain.save
		assert_not duplicate_domain.valid?
	end
end
