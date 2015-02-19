class Api::SessionsController < ApplicationController
	before_action :set_session, only: :new
	before_action :get_and_reset_session, only: :create
	before_action :logged_in_user, only: :destroy 

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

	def destroy
		logout_apiuser
		#TODO: Error message
		response.status = 200
		render :nothing => true
	end



	private

		def logged_in_user
			unless apiuser_logged_in?
				#TODO: Error message
				response.status = 401
				render :nothing => true
			end
		end


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
