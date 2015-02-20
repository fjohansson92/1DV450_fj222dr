class ErrorMessage

	def initialize(developer_message, user_message, error_code)
		@developerMessage = developer_message
		@userMessage = user_message
		@errorCode = error_code
		@more_info = "http://dev.lvh.me:3001/errors##{error_code}"
	end


end