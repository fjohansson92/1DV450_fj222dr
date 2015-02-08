class UsersController < ApplicationController

	def index
		@users = User.all
	end

	def show 
		@user = User.find(params[:id])
	end	

	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
		if @user.save
			redirect_to "/"
		else 
			render 'new'
		end
	end	

	def destroy
		User.find(params[:id]).destroy
		redirect_to users_path
	end	

	private

		def user_params
			params.require(:user).permit(:email, :name, :password, :password_confirmation)
		end	

end
