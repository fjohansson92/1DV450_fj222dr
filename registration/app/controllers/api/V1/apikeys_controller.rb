class Api::V1::ApikeysController < Api::V1::ApplicationController

	def index
		@apikeys = get_offset_limit Apikey::all
	end

	def show
		@apikey = Apikey.find_by_id(params[:id])
		if @apikey.nil?
			@error = ErrorMessage.new("No apikey with requested id.", "Apikey not found", "2601")
			render json: @error, status: :not_found
		end

	end

end
