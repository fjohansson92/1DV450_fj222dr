class Api::V1::TagsController < Api::V1::ApplicationController
	before_filter :partial_response, only: [:index, :show]

	def index
		@tags = get_offset_limit Tag::all
	end

	def show
		@tag = Tag.find_by_id(params[:id])
		
		if @tag.nil?
			@error = ErrorMessage.new("No tag with requested id.", "Tag not found", "2401")
			render json: @error, status: :not_found
		end
	end


	private
		def partial_response
			values_t_show = Tag.get_propertys_as_hash

			filter_response values_t_show
		end



end
