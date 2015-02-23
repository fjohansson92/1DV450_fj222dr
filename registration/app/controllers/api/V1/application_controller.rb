class Api::V1::ApplicationController < ActionController::Base

	include ApiAuthenticator
	include Api::V1::SessionsHelper 

	def get_offset_limit(object)

		limit = params[:limit].to_i > 0 && params[:limit].to_i < 26 ? params[:limit].to_i : 25
		offset = params[:offset].to_i >= 0 ? params[:offset].to_i : 0

		@prev_limit = limit
		@next_limit = limit
		  
		@next_offset = offset + limit if object.length > offset + limit

		@prev_offset = offset - limit 
		if @prev_offset < 0 && offset > 0
	  		@prev_offset = 0
	  		@prev_limit = offset
		elsif @prev_offset < 0
			@prev_offset = nil
		end

		@last_offset = object.length - limit	
		@last_offset = 0 if @last_offset < 0	


		object.limit(limit).offset(offset)
	end

end
