class Api::V1::TagsController < Api::V1::ApplicationController
	

	def index
		#order = params[:order_by_asc] == "true" || params[:order_by_asc] == true ? 'ASC' : 'DESC'

		@tags = get_offset_limit Tag.includes(:restaurants)::all
		
		values_t_show = Tag.get_propertys_as_hash

		filter_restaurants_response values_t_show
	end





end