class RateLimit

  def initialize(app)
    @app = app
  end

	def call(env)

		client_ip = env["REMOTE_ADDR"]
		key = "count:#{client_ip}"
		count = REDIS.get(key)

		if count.nil?
			REDIS.set(key, 0)
			REDIS.expire(key, RATE_LIMIT_TIME)
		end

		if count.to_i >= RATE_LIMIT_MAX
				@error = ErrorMessage.new("API rate limit exceeded for #{client_ip}", "Too many requests. Please wait.", "1429")
				[	429, rate_limit_headers(count, key), [@error.to_json]]
		else

			# Run app
			status, headers, body = @app.call(env)

			# Merge headers
			[ 
				status, 
				headers.merge(rate_limit_headers(REDIS.incr(key), key)),
				body
			]
		end
	end


	private
		def rate_limit_headers(count, key)

			time_to_live = REDIS.ttl(key)
			time_now = Time.now.to_i
			time_till_reset = (time_now + time_to_live.to_i).to_s

			{
				"X-Rate-Limit-Limit" => "10000",
				"X-Rate-Limit-Remaining" => (10000 - count.to_i).to_s,
				"X-Rate-Limit-Reset" => time_till_reset
			}
		end
end