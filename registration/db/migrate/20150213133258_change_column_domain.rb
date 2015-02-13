class ChangeColumnDomain < ActiveRecord::Migration
  def change
  	rename_column :apikeys, :domain, :name
  end
end
