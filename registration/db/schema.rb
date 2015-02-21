# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150221152353) do

  create_table "api_statistics", force: :cascade do |t|
    t.integer  "call",       default: 1
    t.integer  "apikey_id"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "api_statistics", ["apikey_id"], name: "index_api_statistics_on_apikey_id"

  create_table "apikeys", force: :cascade do |t|
    t.string   "key"
    t.string   "name"
    t.boolean  "revoked",    default: false
    t.integer  "user_id"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "apikeys", ["user_id"], name: "index_apikeys_on_user_id"

  create_table "apiusers", force: :cascade do |t|
    t.string   "provider"
    t.string   "uid"
    t.string   "name"
    t.string   "auth_token"
    t.string   "user_token"
    t.datetime "token_expires"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "domains", force: :cascade do |t|
    t.string   "domain"
    t.integer  "apikey_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "domains", ["apikey_id"], name: "index_domains_on_apikey_id"

  create_table "restaurants_tags", id: false, force: :cascade do |t|
    t.integer "restaurant_id"
    t.integer "tag_id"
  end

  add_index "restaurants_tags", ["restaurant_id"], name: "index_restaurants_tags_on_restaurant_id"
  add_index "restaurants_tags", ["tag_id"], name: "index_restaurants_tags_on_tag_id"

  create_table "restaurents", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "phone"
    t.string   "address"
    t.text     "description"
    t.decimal  "longitude",   precision: 8, scale: 6
    t.decimal  "latiude",     precision: 9, scale: 6
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "restaurents", ["user_id"], name: "index_restaurents_on_user_id"

  create_table "tags", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "name"
    t.boolean  "admin",           default: false
    t.string   "password_digest"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "remember_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true

end
