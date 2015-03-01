README Api-registration

Ruby version: 2.1.5
Rails version: 4.2.0

Setup
- Installera Ruby och Rails
- Mac - Installera Redis http://redis.io/download Starta en server
- Windows - Ladda ner https://github.com/MSOpenTech/redis/tree/2.6/bin/release extrahera och kör redis-server.exe
- Redis server Host: localhost Port: 6379
- Kör bundle install
- Kör rake db:migrate
- Kör rake db:seed
- Starta rails server OBS Postman använder port 3001

Buggar:
	Sökfunktionen hanterar inte sökningar på taggars namn korrekt.

Postman länk:
	https://www.getpostman.com/collections/8d9c27b4db2839fb922e


Adminkonto
Användarnamn: admin@mail.com
Lösenord: password


Backend tester
- Kör med rake test



