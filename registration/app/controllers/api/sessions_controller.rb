class Api::SessionsController < ApplicationController
	before_action :set_session, only: [:new]
	before_action :get_and_reset_session, only: [:create]

	def new 
		redirect_to "/auth/github"
	end


	def create

		auth = request.env["omniauth.auth"]
		if auth.nil?
			#TODO: Error message
			response.status = 400
			render :nothing => true	
		else
			apiuser = Apiuser.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Apiuser.create_with_github_omniauth(auth)
			apiuser.update_token @user_token
			if apiuser.save
				redirect_to "#{@url}?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"
			else
				#TODO: Error message
				response.status = 400
				render :nothing => true	
			end
		end
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



	private

		def get_and_reset_session

			if session[:user_token].nil?
				#TODO: Error message
				response.status = 400
				render :nothing => true		
			else
				@user_token = session[:user_token]
				session[:user_token] = nil
				if session[:client_callback].nil?
					#TODO: Error message
					response.status = 400
					render :nothing => true		
				else
					@url = session[:client_callback]
					session[:client_callback] = nil
				end
			end
		end

		def set_session
			if Apiuser.exists?(:user_token => params[:user_token]) || params[:user_token].nil?
				#TODO: Error message
				response.status = 400
				render :nothing => true
			else 
				session[:user_token] = params[:user_token]
				if params[:callback].nil?
					#TODO: Error message
					response.status = 400
					render :nothing => true		
				else
					session[:client_callback] = params[:callback]
				end
			end
		end

end
