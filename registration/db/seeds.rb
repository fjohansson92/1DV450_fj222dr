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

Apikey.create(domain: "https://www.youtube.com/", user_id: user.id)
Apikey.create(domain: "http://reddit.com/", user_id: user.id)


50.times do |n|
	User.create(name: "Username#{n}",
				email: "UserMail-#{n}@example.com",
				password: "password",
				password_confirmation: "password"
		)
end