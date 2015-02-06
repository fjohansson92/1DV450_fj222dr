require 'test_helper'

class UserTest < ActiveSupport::TestCase

  def setup 
  	@user = User.new(email: "a@b.c",name: "Foo Bar", password: "Password", password_confirmation: "Password")
  end

  test "user should be valid" do
  	assert @user.valid?
  end



  # User email tests
  
  test "email should be required" do
  	@user.email = ""
  	assert_not @user.valid? 
  end

  test "email should not be to long" do
  	@user.email = ("a" * 252) + "@b.c"   # Length equals 256
  	assert_not @user.valid?
  end

  test "should accept valid emails" do

  	# Source http://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
  	valid_emails = ["email@example.com",
										"firstname.lastname@example.com",
										"email@subdomain.example.com",
										"firstname+lastname@example.com",
										"email@123.123.123.123",
										"email@[123.123.123.123]",
										'"email"@example.com',
										"1234567890@example.com",
										"email@example-one.com",
										"_______@example.com",
										"email@example.name",
										"email@example.museum",
										"email@example.co.jp",
										"firstname-lastname@example.com",
										"much.”more\ unusual”@example.com",
										"very.unusual.”@”.unusual.com@example.com",
										'very.”(),:;<>[]”.VERY.”very@\\ "very”.unusual@strange.example.com']

		valid_emails.each do |valid_email|
			@user.email = valid_email
			assert @user.valid?, "#{valid_email} should be valid a email"
		end
  end

  test "should not accept invalid emails" do

   	invalid_emails = ["plainaddress",
    									"@example.com",
    									"email.example.com",
    									"email@",]

		invalid_emails.each do |invalid_email|
			@user.email = invalid_email
			assert_not @user.valid?, "#{invalid_email} should be invalid"
		end
  end

  test "email should be unique" do
  	duplicate_user = @user.dup
  	duplicate_user.email = duplicate_user.email.upcase
  	@user.save
  	assert_not duplicate_user.valid?
  end

  test "email should be downcased in database" do
  	@user.email = "A@B.C"
  	@user.save
  	assert_equal @user.reload.email, "a@b.c" 
  end



  # User name tests

  test "name should be required" do
  	@user.name = ""
  	assert_not @user.valid? 
  end
  
  test "name should not be to long" do
  	@user.name = ("f" * 51)
  	assert_not @user.valid?
  end



  # Admin tests
  
  test "admin should not be default" do
  	assert_not @user.admin
  end 



  # Password tests
  
  test "password should not be to short" do
  	@user.password = @user.password_confirmation = ("p" * 5)
  	assert_not @user.valid?
  end

end
