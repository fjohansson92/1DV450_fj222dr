class CreateDomains < ActiveRecord::Migration
  def change
    create_table :domains do |t|

      t.string :domain

      t.belongs_to :apikey, index: true

      t.timestamps null: false
    end
  end
end
