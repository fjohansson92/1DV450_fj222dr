class Api::V1::ApiusersController < Api::V1::ApplicationController

	def index

		@apiusers = get_offset_limit Apiuser::all
		
		values_t_show = Apiuser.get_propertys_as_hash

		filter_response values_t_show
	end

end
