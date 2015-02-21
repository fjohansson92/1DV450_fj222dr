class CreateRestaurantsTagsTable < ActiveRecord::Migration
  def up
    create_table :restaurants_tags, :id => false do |t|
      t.integer "restaurant_id", index: true
      t.integer "tag_id", index: true
    end
  end

  def down
  	drop_table :restaurants_tags
  end
end
