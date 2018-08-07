# url_shortener
SIMPLE URL SHORTENER


Steps to install.

Prerequisites:

1. Should have Mongodb as database installed.
2. Node.js installed.
3. DATABASE ENTRY TO BE MADE - db.counters.insert({ _id: 'url_count', seq: 1 })

Steps to install
1. npm install.
2. Create a .env file mentioning the port for the node process.
2. Create a config.js file in server folder.

(DUMMY EXAMPLE)

var config = {};

config.db = {};
config.webhost = 'WEB_HOST';

config.db.host = 'HOST';
config.db.name = 'DB_NAME';
config.db.username = 'DB_USERNAME';
config.db.password = 'DB_PASSWORD';
config.db.port = DB_PORT;

module.exports = config;

3. app.js  --> Entry point.


For test:

npm test
