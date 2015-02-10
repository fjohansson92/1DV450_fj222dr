class User < ActiveRecord::Base
  has_many :apikeys, :dependent => :destroy
  attr_accessor :remember_token

  before_save { self.email = email.downcase }

  validates :name, presence:true, length: { maximum: 50 }

  # Source for regex http://davidcel.is/blog/2012/09/06/stop-validating-email-addresses-with-regex/
  EMAIL_REGEX = /\A.+@.+\..+\z/
  validates :email, presence:true, length: { maximum: 255 }, uniqueness: { case_sensitive: false }, format: { with: EMAIL_REGEX }

  validates :password, length: { minimum: 6 }, allow_blank: true
  has_secure_password

  def remember
  	self.remember_token = SecureRandom.urlsafe_base64
  	update_attribute(:remember_digest, BCrypt::Password.create(remember_token))
  end

  def authenticated?(remember_token)
  	return false if remember_digest.nil?
  	BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  def forget
  	update_attribute :remember_digest, nil
  end

end