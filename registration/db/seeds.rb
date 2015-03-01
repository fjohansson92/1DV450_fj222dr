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

apikey = Apikey.create(user_id: user.id, name: "Svt", key: "123")
Apikey.create(user_id: user.id, name: "github")

Domain.create(domain: "http://api.lvh.me:3001/", apikey_id: apikey.id)




4.times do |n|
	ApiStatistic.create(call: n * (500 + 1), apikey_id: apikey.id)
end

tag1 = nil
tag2 = nil
["Pizzeria", "Café", "Restaurang"].each do |n, index|
	if index == 1
		tag1 = Tag.create(name: n)
	elsif index == 2
		tag2 = Tag.create(name: n)
	else
 		Tag.create(name: n)
	end
end

Apiuser.create(provider: "Github",
			   uid: "123123",
			   name: "Filip",
			   auth_token: "tokentoken",
			   user_token: "usertoken",
			   token_expires: Time.now + 1.year
	)



apiuser = Apiuser.first
30.times do |n|
	restaurant = Restaurant.create(name: "Restaurang#{n}",
					  phone: "#{n}123456",
					  address: "Gata #{n}",
					  description: "Beskrivning nr #{n}",
					  longitude: "#{n * 3}",
					  latitude: "#{n * 3}",
					  apiuser_id: apiuser.id 
		)
	restaurant.tags << Tag.first
	restaurant.tags << Tag.last
end


50.times do |n|
	User.create(name: "Username#{n}",
				email: "UserMail-#{n}@example.com",
				password: "password",
				password_confirmation: "password"
		)
end