module Api::V1::SessionsHelper

	def apiuser_logged_in?
		!current_apiuser.nil?
	end

	def current_apiuser
		auth_token = request.headers["auth-token"] || nil
		user_token = request.headers["user-token"] || nil

		user = nil

		if auth_token
			user = Apiuser.find_by_auth_token(auth_token) || nil
		end

		user.nil? || user_token.nil? || user_token != user.user_token || user.token_expires < Time.now ? nil : user
	end

	def logout_apiuser
		user = current_apiuser
		user.user_token = nil
		user.auth_token = nil
		user.token_expires = nil
		user.save
	end

end
