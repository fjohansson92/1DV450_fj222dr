require 'uri'
class Domain < ActiveRecord::Base
	belongs_to :apikey

	validates :domain, presence:true, length: { maximum: 255 }, format: { with: URI.regexp }, uniqueness: { case_sensitive: false }
end
