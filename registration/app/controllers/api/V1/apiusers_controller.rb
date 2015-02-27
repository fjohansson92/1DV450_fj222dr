class Api::V1::ApiusersController < Api::V1::ApplicationController
	before_filter :partial_response, only: [:index, :show]


	def index
		@apiusers = get_offset_limit Apiuser::all
	end

	def show
		@apiuser = Apiuser.find_by_id(params[:id])
		
		if @apiuser.nil?
			@error = ErrorMessage.new("No apiuser with requested id.", "Apiuser not found", "2301")
			render json: @error, status: :not_found
		end
	end

	private
		def partial_response
			values_t_show = Apiuser.get_propertys_as_hash

			filter_response values_t_show
		end

end
