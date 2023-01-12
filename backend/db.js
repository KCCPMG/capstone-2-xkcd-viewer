const { Client } = require('pg');
const { getDatabaseUri } = require('./config');

let db;
if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  })
} else {
  db = new Client({
    connectionString: getDatabaseUri()
  })
}

// console.log(`From db.js, NODE_ENV: ${process.env.NODE_ENV}`)
db.connect();
db.on('connect', ()=>{console.log(`Connected to: ${db.database}`)})
db.on('error', (err) => {console.log(err)})
console.log(`From db.js: ${db.database}`);

module.exports = db;
