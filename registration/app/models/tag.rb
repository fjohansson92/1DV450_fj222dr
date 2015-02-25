class Tag < ActiveRecord::Base
  has_and_belongs_to_many :restaurants

  validates :name, presence:true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }

  	def self.get_propertys_as_hash
		{ 
			:id => "id",
			:name => "name",
			:links => "links" 
		}
	end
end
