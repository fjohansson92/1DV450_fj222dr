class UsersController < ApplicationController
 	before_action :logged_in_user, only: [:index, :edit, :update, :show, :destroy]
  	before_action :correct_user, only: [:edit, :update, :show, :destroy]
  	before_action :admin_user, only: [:index]


	def index
		@users = User.paginate(page: params[:page])
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
			log_in @user
			flash[:success] = "Du är nu registrerad!"
			redirect_to root_path
		else 
			render 'new'
		end
	end	

	def edit
		@user = User.find(params[:id])
	end

	def update
		@user = User.find(params[:id])
		if @user.update_attributes(user_params)
			flash[:success] = "Redigeringen lyckades!"
			redirect_to @user
		else 
			render 'edit'
		end
	end	


	def destroy
		flash[:success] = "Användaren har tagits bort!"
		User.find(params[:id]).destroy
		redirect_to users_path
	end	

	private

		def user_params
			params.require(:user).permit(:email, :name, :password, :password_confirmation)
		end	

		def logged_in_user
			unless logged_in?
				redirect_to login_path
			end
		end

		def correct_user
			@user = User.find(params[:id])
			redirect_to root_path unless current_user == @user || current_user.admin?
		end

		def admin_user
			redirect_to root_path unless current_user.admin?
		end
end
