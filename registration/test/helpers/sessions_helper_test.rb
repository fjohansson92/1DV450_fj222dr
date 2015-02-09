require 'test_helper'

class SessionsHelperTest < ActionView::TestCase

  def setup
    @user = users(:filip)

    #TODO: Remember user    
  end

  test "current_user returns correct user when no session" do
    assert_equal @user, current_user
    assert is_logged_in
  end

  test "current_user returns no user when wrong remember_digest " do 
    #TODO: Update user remember_digest
    assert_nil current_user
  end

end