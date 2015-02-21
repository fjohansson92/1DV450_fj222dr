include ActionController::HttpAuthentication::Token

module ApiAuthenticator
	def self.included(base)
	    base.before_filter :authenticate
	end

	def authenticate
      apikey = authenticate_token || render_unauthorized
      if apikey
			if apikey.revoked
				@error = ErrorMessage.new("API-key is revoked", "Request failed, contact developer.", "2101")
			  	render json: @error, status: :unauthorized
			else
				domain = apikey.domains.where('? LIKE Domain || "%"', "#{request.url}").first
				if domain.nil?
					@error = ErrorMessage.new("API-key dosen't match domain, your request was from #{request.url}", "Request failed, contact developer.", "2102")
					render json: @error, status: :unauthorized
				else
					api_statistics = apikey.api_statistics.where("created_at >= ?", Time.zone.now.beginning_of_day).first
					if api_statistics.nil?
						api_statistics = apikey.api_statistics.create
						api_statistics.save
					else
						api_statistics.api_call
					end
				end
			end
      end
	end

	def authenticate_token
		apikey = nil
		authenticate_with_http_token do |token, options|
		  apikey = Apikey.where(key: token).first
		end
		apikey
	end

	def render_unauthorized
	    self.headers['WWW-Authenticate'] = 'Token realm="Application"'
	    @error = ErrorMessage.new("API-key is missing or invalid", "Request failed, contact developer.", "1401b")
		render json: @error, status: :unauthorized
		nil
	end
end
