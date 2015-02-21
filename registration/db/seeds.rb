# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

user = User.create(name: "Admin",
			email: "admin@mail.com",
			password: "password",
			password_confirmation: "password",
			admin: true
		)

apikey = Apikey.create(user_id: user.id, name: "Svt")
Apikey.create(user_id: user.id, name: "github")

4.times do |n|
	ApiStatistic.create(call: n * (500 + 1), apikey_id: apikey.id)
end



50.times do |n|
	User.create(name: "Username#{n}",
				email: "UserMail-#{n}@example.com",
				password: "password",
				password_confirmation: "password"
		)
end