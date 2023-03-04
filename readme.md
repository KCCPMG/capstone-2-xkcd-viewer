# XKCD Viewer

## Overview

This is a full PERN stack app that was designed to give users the ability to read, upvote, and favorite xkcd comics.

## Features

- Sign up, log in and out
- View comics one by one, and upvote and/or favorite for logged in users
- View the most upvoted comics on one page, sorted in descending order of upvotes
- View comics that you have favorited

## Running the Project

To see this live, go to [https://xkcd-view.surge.sh/](https://xkcd-view.surge.sh/).

To run this locally:

Backend:

1. `cd backend`
2. `npm install`
3. Create a .env file with a `SECRET_KEY` and a `PORT`
4. Create the databases
  - `createdb xkcd`
  - `createdb xkcd_test`
5. Populate both databases with comics.json
  - `cd seed`
  - `node`
  - `const seed = require('./seed');`
  - To seed xkcd_test `seed.seedTestDB();`
  - To seed xkcd `seed.seedProdDB();`
6. Quit node, return to backend directory `cd ..`
7. To update the production database
  - open node
  - `const collector = require('./seed/collector);`
  - `collector.updateDatabase();`
  - quit node
8. To run the server, `node server.js` or `node server.js --TESTMODE` to use xkcd_test

NOTE: lines 8-10 in 'db.js' may need to be commented out, as the ssl configuration option for production is configured to match heroku's run environment. This line may cause local deployments to encounter a pg error.

Frontend:

1. `cd ../frontend`
2. `npm start`


## Dependencies

##### Backend
- This is an Express/Postgres Backend 
- Add-on Packages include
  - axios
  - bcrypt
  - colors
  - cors
  - dotenv
  - jest
  - jsonwebtoken
  - morgan
  - pg
  - supertest

##### Frontend
- This is a React frontend created with create-react-app
- Add-on Packages include
  - axios
  - jsonwebtoken
  - react-router-dom
  - react-tooltip
- Styling done with bootstrap, react-bootstrap, and react-bootstrap-icons

