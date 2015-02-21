class Tag < ActiveRecord::Base
  has_and_belongs_to_many :restaurants

  validates :name, presence:true, length: { maximum: 50 }, uniqueness: { case_sensitive: false }
end
