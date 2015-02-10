require 'uri'

class Apikey < ActiveRecord::Base
	belongs_to :user
	after_initialize :create_apikey

  validates :key, presence:true, length: { maximum: 255 }
	validates :domain, presence:true, length: { maximum: 255 }, format: { with: URI.regexp }, uniqueness: { case_sensitive: false }

	private
		def create_apikey
			key = nil
			loop do
				key = SecureRandom.hex
				break unless Apikey.exists?(key: key)
			end
			self.key ||= key
		end
end
