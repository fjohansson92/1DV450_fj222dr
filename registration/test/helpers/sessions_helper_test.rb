require 'test_helper'

class SessionsHelperTest < ActionView::TestCase

  def setup
    @user = users(:filip)
    remember @user
  end

  test "current_user returns correct user when no session" do
    assert_equal @user, current_user
    assert is_logged_in?
  end

  test "current_user returns no user when wrong remember_digest " do 
    @user.update_attribute(:remember_digest, BCrypt::Password.create(SecureRandom.urlsafe_base64)) 
    assert_nil current_user
    assert_not is_logged_in?
  end

end