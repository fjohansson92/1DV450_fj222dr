class ApikeysController < ApplicationController
	before_action :logged_in_user, :correct_user


	def index
		@user = User.find(params[:user_id])
		@apikeys = @user.apikeys
	end

	def show 
		@user = User.find(params[:user_id])
		@apikey = Apikey.find(params[:id])
	end


	def new
		@user = User.find(params[:user_id])
		@apikey = Apikey.new(:user => @user)
	end

	def create
		@apikey = current_user.apikeys.new(apikey_params)
		if @apikey.save
			redirect_to action: "index"
		else 
			render 'new'
		end
	end

	def edit
		@user = User.find(params[:user_id])
		@apikey = Apikey.find(params[:id])
	end

	def update
		@user = User.find(params[:user_id])
		@apikey = Apikey.find(params[:id])
		if not_allowed_edit
			render 'edit'
		else 
			if @apikey.update_attributes(apikey_params)
				redirect_to action: "index"
			else 
				render 'edit'
			end
		end
	end	

	def destroy
		@user = User.find(params[:user_id])
		@apikey = Apikey.find(params[:id])
		if not_allowed_edit
			redirect_to user_apikey_path(@user, @apikey)
		else	
			redirect_to action: "index"
			@apikey.destroy
		end
	end	


	private

		def not_allowed_edit
			@apikey.revoked && !current_user.admin?
		end

		def apikey_params
			current_user.admin? ? params.require(:apikey).permit(:domain, :revoked) : params.require(:apikey).permit(:domain)
		end

		def correct_user
			@user = User.find(params[:user_id])
			redirect_to root_path unless current_user == @user || current_user.admin?
		end

		def logged_in_user
			unless logged_in?
				redirect_to login_path
			end
		end
end
