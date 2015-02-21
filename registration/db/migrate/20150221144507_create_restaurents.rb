class CreateRestaurents < ActiveRecord::Migration
  def change
    create_table :restaurants do |t|

      t.belongs_to :apiuser, index: true

	  t.string :name
	  t.string :phone
	  t.string :address
	  t.text :description

	  t.decimal :longitude, precision: 9, scale: 6
	  t.decimal :latitude, precision: 8, scale: 6

      t.timestamps null: false
    end
  end
end
