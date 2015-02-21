class CreateApiStatistics < ActiveRecord::Migration
  def change
    create_table :api_statistics do |t|

      t.integer :call, :default => 1

      t.belongs_to :apikey, index: true

      t.timestamps null: false
    end
  end
end
