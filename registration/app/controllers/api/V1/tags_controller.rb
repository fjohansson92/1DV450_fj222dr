class Api::V1::TagsController < Api::V1::ApplicationController
	

	def index

		@tags = get_offset_limit Tag::all
		
		values_t_show = Tag.get_propertys_as_hash

		filter_response values_t_show
	end





end
