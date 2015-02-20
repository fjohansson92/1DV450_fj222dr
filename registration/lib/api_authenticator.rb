include ActionController::HttpAuthentication::Token

module ApiAuthenticator
	def self.included(base)
	    base.before_filter :authenticate
	end

	def authenticate
      api_key = authenticate_token || render_unauthorized
      if api_key
			if api_key.revoked
				@error = ErrorMessage.new("API-key is revoked", "Request failed, contact developer.", "2101")
			  	render json: @error, status: :unauthorized
			else
				domain = api_key.domains.where('? LIKE Domain || "%"', "#{request.url}").first
				if domain.nil?
					@error = ErrorMessage.new("API-key dosen't match domain, your request was from #{request.url}", "Request failed, contact developer.", "2102")
					render json: @error, status: :unauthorized
				end
			end
      end
	end

	def authenticate_token
		api_key = nil
		authenticate_with_http_token do |token, options|
		  api_key = Apikey.where(key: token).first
		end
		api_key
	end

	def render_unauthorized
	    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
	    @error = ErrorMessage.new("API-key is missing or invalid", "Request failed, contact developer.", "1401b")
		render json: @error, status: :unauthorized
		nil
	end
end
