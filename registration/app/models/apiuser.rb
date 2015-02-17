class Apiuser < ActiveRecord::Base

	validates :provider, presence:true
	validates :uid, presence:true
	validates :name, presence:true

	def self.create_with_github_omniauth(auth)
		create! do |user|
			user.provider = auth["provider"]
			user.uid = auth["uid"]
			user.name = auth["info"]["name"]
		end
	end

	def update_token
		self.token_expires = Time.now + 1.hour
		self.auth_token = SecureRandom.urlsafe_base64(nil, false)
	end

end
