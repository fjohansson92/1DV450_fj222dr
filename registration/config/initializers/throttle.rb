RATE_LIMIT_TIME = 5 * 60
RATE_LIMIT_MAX = 20000

REDIS = Redis.new(:host => 'localhost', port: 6379 )
