class CreateApikeys < ActiveRecord::Migration
  def change
    create_table :apikeys do |t|

      t.string :key
      t.string :domain
      t.boolean :revoked, :default => false

      t.belongs_to :user, index: true

      t.timestamps null: false
    end
  end
end
