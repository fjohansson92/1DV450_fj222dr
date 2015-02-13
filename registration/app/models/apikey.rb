require 'uri'

class Apikey < ActiveRecord::Base
	belongs_to :user
	has_many :domains, :dependent => :destroy
	after_initialize :create_apikey

  	validates :key, presence:true, length: { maximum: 255 }
	validates :name, presence:true, length: { maximum: 50 }


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
