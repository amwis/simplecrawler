Quick script currently able to crawl through a particular domain if it does not require authentication (no login, session tokens or similar)

Requirements:
nodejs 14 or higher
- npm install `cheerio` and `requests`

To use:
1. Open the sessionless.js file in a text editor
   a) update the starting url you'd like to visit
   b) modify the domain so that the crawler does not scope out of the domain you want to crawl
2. Using node run sessionless.js (i.e. `node sessionless.js`)
3. If you want to output the results to a file, using shell do the following: `node sessionsless.js >> [filename].txt`
