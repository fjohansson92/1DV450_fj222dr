class Api::SessionsController < ApplicationController


	def new 
		session[:client_callback] = params[:callback]
		session[:user_token] = params[:user_token]

		redirect_to "/auth/github"
	end


	def create
		auth = request.env["omniauth.auth"]
		
		user_token = session[:user_token]
		session[:user_token] = nil

		apiuser = Apiuser.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Apiuser.create_with_github_omniauth(auth)
		apiuser.update_token user_token
		apiuser.save
		
		url = session[:client_callback]
		session[:client_callback] = nil

		redirect_to "#{url}?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"
	end





	# Temporary test method
	def test

		auth_token = request.headers["X-auth-token"] || nil
		user_token = request.headers["X-user-token"] || nil

		user = nil

		if auth_token
			user = Apiuser.find_by_auth_token(auth_token) || nil
		end

		if(user.nil? || user_token.nil? || user_token != user.user_token || user.token_expires < Time.now)
			response.status = 401
			render :nothing => true
		else
			response.status = 200
			render :json => user
		end
	end

end
