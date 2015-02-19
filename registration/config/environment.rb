# Load the Rails application.
require File.expand_path('../application', __FILE__)

# Initialize the Rails application.
Rails.application.initialize!

OmniAuth.config.test_mode = true
OmniAuth.config.mock_auth[:github] = OmniAuth::AuthHash.new({
  :provider => 'github',
  :uid => '123545',
  :info => { :name => 'Filip Johansson'}
})

OmniAuth.config.mock_auth[:noprovider] = OmniAuth::AuthHash.new({
  :uid => '123545',
  :info => { :name => 'Filip Johansson'}
})
