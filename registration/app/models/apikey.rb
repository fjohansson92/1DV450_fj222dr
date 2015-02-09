require 'uri'

class Apikey < ActiveRecord::Base
	belongs_to :user

  validates :key, presence:true, length: { maximum: 255 }
	validates :domain, presence:true, length: { maximum: 255 }, format: { with: URI.regexp }

end
