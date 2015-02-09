class CreateApikeys < ActiveRecord::Migration
  def change
    create_table :apikeys do |t|

      t.string :key
      t.string :domain
      t.boolean :valid, :default => true, index: true

      t.belongs_to :user

      t.timestamps null: false
    end
  end
end
