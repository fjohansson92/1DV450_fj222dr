Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, '1ef1ff189512512e36af', 'e237862091d7884307bb809f638aaa76138c5b64'
end