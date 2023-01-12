const fs = require('fs');


const seedTestDB = async () => {
  
  process.env.NODE_ENV = "test";
  // const { getDatabaseUri } = require('../config');
  const db = require('../db');
  db.on('connect', async () => {
    console.log(`From seed.js on connect: ${db.database}`);
    await db.query('DROP TABLE IF EXISTS comics CASCADE;');
  
    await db.query(`CREATE TABLE comics(
      num INTEGER PRIMARY KEY,
      month TEXT,
      link TEXT,
      year TEXT,
      news TEXT,
      safe_title TEXT,
      transcript TEXT,
      alt TEXT,
      img TEXT,
      title TEXT,
      day TEXT
      );`
    );

    const comics = JSON.parse(fs.readFileSync('./comics.json'));
    
    for (let comic of comics) {
      let {num, month, link, year, news, safe_title, transcript, alt, img, title, day} = comic;
      await db.query(`INSERT INTO comics
        (num, month, link, year, news, safe_title, transcript, alt, img, title, day)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [num, month, link, year, news, safe_title, transcript, alt, img, title, day])
    }

    await Promise.all([
      db.query('DROP TABLE IF EXISTS users CASCADE;'),
      db.query('DROP TABLE IF EXISTS upvotes;'),
      db.query('DROP TABLE IF EXISTS favorites;')
    ])

    await db.query(`CREATE TABLE users (
      id TEXT UNIQUE PRIMARY KEY, 
      email TEXT UNIQUE,
      username TEXT UNIQUE, 
      hashed_password TEXT, 
      created_at TIMESTAMPTZ,
      
      CONSTRAINT email_address CHECK (POSITION('@' IN email) > 1), 
      CONSTRAINT email_length CHECK (LENGTH(email)>5),
      CONSTRAINT username_chars CHECK (username ~ '^[a-zA-Z0-9]*$'),
      CONSTRAINT username_length CHECK (LENGTH(username)>5)
    );`);

    await Promise.all([
      db.query(`CREATE TABLE upvotes (
        user_id TEXT REFERENCES users (id),
        comic_num INTEGER REFERENCES comics (num));`),
      db.query(`CREATE TABLE favorites (
        user_id TEXT REFERENCES users (id),
        comic_num INTEGER REFERENCES comics (num));`)
    ])

    console.log("done");

    
  })  

}




const seedProdDB = async() => {

  process.env.NODE_ENV === "production"

  const db = require('../db');
  db.on('connect', async () => {
    console.log(`From seed.js on connect: ${db.database}`);
    await db.query('DROP TABLE IF EXISTS comics CASCADE;');
  
    await db.query(`CREATE TABLE comics(
      num INTEGER PRIMARY KEY,
      month TEXT,
      link TEXT,
      year TEXT,
      news TEXT,
      safe_title TEXT,
      transcript TEXT,
      alt TEXT,
      img TEXT,
      title TEXT,
      day TEXT
      );`
    );

    const comics = JSON.parse(fs.readFileSync('./comics.json'));
    
    for (let comic of comics) {
      let {num, month, link, year, news, safe_title, transcript, alt, img, title, day} = comic;
      await db.query(`INSERT INTO comics
        (num, month, link, year, news, safe_title, transcript, alt, img, title, day)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [num, month, link, year, news, safe_title, transcript, alt, img, title, day])
    }

    await Promise.all([
      db.query('DROP TABLE IF EXISTS users CASCADE;'),
      db.query('DROP TABLE IF EXISTS upvotes;'),
      db.query('DROP TABLE IF EXISTS favorites;')
    ])

    await db.query(`CREATE TABLE users (
      id TEXT UNIQUE PRIMARY KEY, 
      email TEXT UNIQUE,
      username TEXT UNIQUE, 
      hashed_password TEXT, 
      created_at TIMESTAMPTZ,
      
      CONSTRAINT email_address CHECK (POSITION('@' IN email) > 1), 
      CONSTRAINT email_length CHECK (LENGTH(email)>5),
      CONSTRAINT username_chars CHECK (username ~ '^[a-zA-Z0-9]*$'),
      CONSTRAINT username_length CHECK (LENGTH(username)>5)
    );`);

    await Promise.all([
      db.query(`CREATE TABLE upvotes (
        user_id TEXT REFERENCES users (id),
        comic_num INTEGER REFERENCES comics (num));`),
      db.query(`CREATE TABLE favorites (
        user_id TEXT REFERENCES users (id),
        comic_num INTEGER REFERENCES comics (num));`)
    ])

    console.log("done");

    
  })
}

module.exports = {seedProdDB, seedTestDB}