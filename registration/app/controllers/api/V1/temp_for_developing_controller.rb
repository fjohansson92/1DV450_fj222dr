class Api::V1::TempForDevelopingController < Api::V1::ApplicationController

	def index
		render json: { message: "Giltlig API nyckel" }, status: :ok
	end

end
