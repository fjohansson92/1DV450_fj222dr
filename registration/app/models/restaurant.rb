class Restaurant < ActiveRecord::Base
  belongs_to :apiuser
  has_and_belongs_to_many :tags

	validates :name, presence:true, length: { maximum: 50 }
	validates :phone, presence:true, length: { maximum: 12 }
	validates :address, presence:true, length: { maximum: 100 }
	validates :description, presence:true

	LONGITUDE_REGEX = /\A[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)\z/
	validates :longitude, presence:true, :numericality => true, format: { with: LONGITUDE_REGEX }

	LATITUDE_REGEX = /\A[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)\z/
	validates :latitude, presence:true, :numericality => true, format: { with: LATITUDE_REGEX }
end
