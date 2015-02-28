class Restaurant < ActiveRecord::Base
  belongs_to :apiuser
  has_and_belongs_to_many :tags#, autosave: false
  accepts_nested_attributes_for :tags
  before_save :test

	validates :name, presence:true, length: { maximum: 50 }
	validates :phone, presence:true, length: { maximum: 12 }
	validates :address, presence:true, length: { maximum: 100 }
	validates :description, presence:true

	LONGITUDE_REGEX = /\A[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)\z/
	validates :longitude, presence:true, :numericality => true, format: { with: LONGITUDE_REGEX }

	LATITUDE_REGEX = /\A[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)\z/
	validates :latitude, presence:true, :numericality => true, format: { with: LATITUDE_REGEX }

	 
	def test
		self.tags.each { |key|
		 	if Tag.find_by_name(key.name)
		 		self.tags.delete(key)
		 		self.tags << Tag.find_by_name(key.name)
		 	end
		 }		
	end


	def self.get_propertys_as_hash
		{ 
			:id => "id", 
			:name => "name", 
			:phone => "phone", 
			:address => "address", 
			:longitude => "longitude", 
			:latitude => "latitude", 
			:description => "description",
			:links => "links",
			:tags => "tags",
			:apiuser => 'apiuser'
		}
	end

	def self.get_child_propertys_as_hash
		{ 
			:tags => { 
						:selector => "tags(", 
						:parent_selector => "tags",	
						:tagshash => Tag.get_propertys_as_hash
			},
			:apiuser => { 
						:selector => "apiuser(", 
						:parent_selector => "apiuser",
						:tagshash => Apiuser.get_propertys_as_hash
			} 
		}
	end
end
