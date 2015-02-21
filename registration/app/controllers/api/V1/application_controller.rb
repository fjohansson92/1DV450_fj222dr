class Api::V1::ApplicationController < ActionController::Base

  include ApiAuthenticator
  include Api::V1::SessionsHelper 
end
