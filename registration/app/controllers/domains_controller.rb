class DomainsController < ApplicationController
	before_action :logged_in_user, :correct_user


	def create

		@domain = @apikey.domains.new(domain_params)

		if @domain.save
			flash[:success] = "Domänen är registrerad!"
			redirect_to user_apikey_path(@user, @apikey)
		else 
			@apikey.reload
			render "apikeys/show"
		end
	end


	def destroy
		
		@domain = Domain.find(params[:id])

		if not_allowed_edit
			flash[:danger] = "Du kan inte redigerad en ogiltlig API-nyckels domäner!"
			@domain = Domain.new(:apikey => @apikey)
			render "apikeys/show"
		else
			@domain.destroy
			flash[:success] = "Domänen är borttagen!"
			redirect_to user_apikey_path(@user, @apikey)	
		end
	end	

	private

		def not_allowed_edit
			@apikey.revoked && !current_user.admin?
		end

		def domain_params
			params.require(:domain).permit(:domain)
		end

		def correct_user
			@user = User.find(params[:user_id])
			@apikey = Apikey.find(params[:apikey_id])
			redirect_to root_path unless (current_user == @user && @apikey.user == @user) || current_user.admin?
		end

		def logged_in_user
			unless logged_in?
				redirect_to login_path
			end
		end
end
