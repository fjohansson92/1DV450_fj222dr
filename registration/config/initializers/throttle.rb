RATE_LIMIT_TIME = 5 * 60
RATE_LIMIT_MAX = 60

REDIS = Redis.new(:host => 'localhost', port: 6379 )
