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




20.times do |n|
	ApiStatistic.create(call: n * (500 + 1), apikey_id: apikey.id, created_at: Time.now - n.day)
end

["Pizzeria", "Café", "Restaurang", "Bar", "Hamburgerrestaurang", "SushiRestaurang", "McDonald's", "Burger King", "Pizza Hut", "Taco Bell", "Glasskiosk", 
 "A&W Restaurants","Arby's","Arctic Circle Restaurants","Arthur Treacher's","Atlanta Bread Company","Au Bon Pain","Auntie Anne's","Baja Fresh","Baskin-Robbins","Ben & Jerry's","Big Boy","Blimpies","Bojangles' Famous Chicken 'n Biscuits","Boston Market","Braum's","Burger Chef","Burger King","Burger Street","Burgerville","Captain D's Seafood Kitchen","Carino's Italian Grill","Carl's Jr.","Carrows","Carvel Ice Cream","Charley's Grilled Subs","Checkers / Rally's","Cheeburger Cheeburger","Chevys Fresh Mex","Chicken Express","Chick-fil-A","Chronic Tacos","Chuck-A-Rama","Church's / Texas Chicken","CiCi's Pizza","Cinnabon","Claim Jumper","Coco's Bakery","Cold Stone Creamery","Copeland's","Country Buffet","Culver's","Dairy Mart","Dairy Queen","Del Taco","Dinosaur Bar-B-Que","Dixie Chili and Deli","Domino's Pizza","Don Pablo's","Donatos Pizza","Druther's","Dunkin' Donuts","East of Chicago Pizza","EatZi's","Eat'n Park","Eegee's","El Chico","El Pollo Loco","Elephant Bar","Elevation Burger","El Taco Tote","Famous Dave's","Farmer Boys","Fatburger","Five Guys Famous Burgers and Fries","Fox's Pizza Den","Freddy's Frozen Custard & Steakburgers","Gino's Pizza and Spaghetti","Godfather's Pizza","Golden Chick","Green Burrito / Red Burrito","The Halal Guys","Hardee's","Huddle House","Hungry Howie's Pizza","In-N-Out Burger","Jack in the Box","Jack's","Jamba Juice","Jerry's Subs & Pizza","Jersey Mike's Subs","Jimmy John's","Jim's Restaurants","Johnny Rockets","Kewpee","KFC","Krispy Kreme","L&L Hawaiian Barbecue","Ledo Pizza","Lee Roy Selmon's","Lee's Famous Recipe Chicken","Little Caesars Pizza","Long John Silver's","Luby's","McDonald's","Milo's Hamburgers","Moe's Southwest Grill","Mr. Hero","Mrs. Fields","Mrs. Winner's Chicken & Biscuits","Naugles","Panda Express","Papa John's Pizza","Papa Murphy's Take 'N' Bake pizza","Penn Station East Coast Subs","Pita Pit","Pizza Hut","Pizza Inn","Popeyes Chicken & Biscuits","Port of Subs","Potbelly Sandwich Works","Quizno's Classic Subs","Raising Cane's Chicken Fingers","Rax","Robeks","Roy Rogers Restaurants","Runza","Saladworks","Sbarro","Schlotzsky's","Seattle's Best Coffee","Shake Shack","Skyline Chili","Smoothie King","Sneaky Pete's","Sonic Drive-In","Spangles","Starbucks Coffee","Steak 'n Shake","Stir Crazy","Sub Station II","Subway","Swensen's","Swensons","Taco Bell","Taco Bueno","Taco John's","Taco Mayo","Taco Tico","Taco Time","ThunderCloud Subs","Twin Peaks","Umami Burger","Uncle Maddio's Pizza Joint","Wendy's","Wetzel's Pretzels","Whataburger","White Castle","Wienerschnitzel","Zero's Subs","Zippy's","Zpizza",
].each do |n, index|
 	Tag.create(name: n)
end

Apiuser.create(provider: "Github",
			   uid: "123123",
			   name: "Filip",
			   auth_token: "tokentoken",
			   user_token: "usertoken",
			   token_expires: Time.now + 1.year
	)



apiuser = Apiuser.first
300.times do |n|
	prng = Random.new(n)
	restaurant = Restaurant.create(name: "Restaurang#{n}",
					  phone: "#{n}123456",
					  address: "Gata #{n}",
					  description: "Beskrivning nr #{n}",
					  longitude: "#{ prng.rand(-179.0..180.0) }",
					  latitude: "#{ prng.rand(-89.0..90.0) }",
					  apiuser_id: apiuser.id 
		)
	if n < 150
		restaurant.tags << Tag.find(n+1)
		restaurant.tags << Tag.find(n+2)
	else
		restaurant.tags << Tag.find(n - 149)
		restaurant.tags << Tag.find(n - 148)
	end
end




50.times do |n|
	User.create(name: "Username#{n}",
				email: "UserMail-#{n}@example.com",
				password: "password",
				password_confirmation: "password"
		)
end



