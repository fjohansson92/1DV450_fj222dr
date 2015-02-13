require 'uri'
class Domain < ActiveRecord::Base


	#validates :domain, presence:true, length: { maximum: 255 }, format: { with: URI.regexp }, uniqueness: { case_sensitive: false }
end
