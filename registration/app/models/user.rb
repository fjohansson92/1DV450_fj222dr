class User < ActiveRecord::Base

	before_save { self.email = email.downcase }

	validates :name, presence:true, length: { maximum: 50 }

	# Source for regex http://davidcel.is/blog/2012/09/06/stop-validating-email-addresses-with-regex/
	EMAIL_REGEX = /\A.+@.+\..+\z/
  validates :email, presence:true, length: { maximum: 255 }, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }

  validates :password, length: { minimum: 6 }, allow_blank: true
  has_secure_password
end