class Api::V1::SessionsController < Api::V1::ApplicationController
	before_action :set_session, only: :new
	before_action :get_and_reset_session, only: :create
	before_action :logged_in_user, only: :destroy 
	skip_before_filter :authenticate, :only => [:create]

	def new 
		redirect_to "/v1/auth/github"
	end


	def create

		auth = request.env["omniauth.auth"]
		if auth.nil?
			@error = ErrorMessage.new("Auth data from github wasn't found", "Login failed. Contact developer", "2003")
			render json: @error, status: :bad_request
		else
			apiuser = Apiuser.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Apiuser.create_with_github_omniauth(auth)
			apiuser.update_token @user_token
			if apiuser.save
				redirect_to "#{@url}?auth_token=#{apiuser.auth_token}&token_expires=#{Rack::Utils.escape(apiuser.token_expires.to_s)}"
			else
				@error = ErrorMessage.new("Couldn't create user, see user messages.", apiuser.errors.messages, "2004")
				render json: @error, status: :bad_request
			end
		end
	end

	def destroy
		logout_apiuser
		render json: { message: "User is logged out" }, status: :ok
	end


	private

		def logged_in_user
			unless apiuser_logged_in?
				@error = ErrorMessage.new("The user needs to login", "Bad credentials", "1401")
				render json: @error, status: :unauthorized
			end
		end

		def get_and_reset_session

			if session[:user_token].nil?
				@error = ErrorMessage.new("Missing user_token in request headers", "Login failed. Contact developer", "2001")
				render json: @error, status: :bad_request
			else
				@user_token = session[:user_token]
				session[:user_token] = nil
				if session[:client_callback].nil?
					@error = ErrorMessage.new("Missing client_callback in request headers", "Login failed. Contact developer", "2002")
					render json: @error, status: :bad_request	
				else
					@url = session[:client_callback]
					session[:client_callback] = nil
				end
			end
		end

		def set_session
			if Apiuser.exists?(:user_token => params[:user_token]) || params[:user_token].nil?
				@error = ErrorMessage.new("Missing or existing user_token", "Login failed. Contact developer", "2005")
				render json: @error, status: :bad_request
			else 
				session[:user_token] = params[:user_token]
				if params[:callback].nil?
					@error = ErrorMessage.new("Missing callback", "Login failed. Contact developer", "2006")
					render json: @error, status: :bad_request	
				else
					session[:client_callback] = params[:callback]
				end
			end
		end

end
