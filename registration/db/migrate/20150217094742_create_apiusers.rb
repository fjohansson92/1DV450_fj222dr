class CreateApiusers < ActiveRecord::Migration
  def change
    create_table :apiusers do |t|

    	t.string :provider
    	t.string :uid
    	t.string :name
    	t.string :auth_token
      t.string :user_token
    	t.datetime :token_expires

      t.timestamps null: false
    end
  end
end
