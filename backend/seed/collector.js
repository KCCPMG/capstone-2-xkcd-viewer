/**
 * Various helper functions to help collect comics data to put 
 * into 'comics.json'
 * 'comics.json' will then be used to populate the comics table
 * These functions were mainly used in the node replit to get the 
 * data, then write comics.json 
 */


const axios = require('axios');
const fs = require('fs');
const db = require('../db');

/** Simple function for getting a comic and logging the json data */
function logComic(comicId) {
  axios.get(`https://xkcd.com/${comicId}/info.0.json`)
  .then((res) => {
    console.log(res.data);
  })
}

/** async function which returns the json data from a given comic */
async function getComic(comicId) {
  const res = await axios.get(`https://xkcd.com/${comicId}/info.0.json`);
  return res.data;
}

/** synchronous function which assigns the json data from a given comic
 *  to a given variable. This function exists really only for use in the replit
 *  where async functions can't be used
 *  
 *  example:
 *  let obj;
 *  getComicSync(1, obj);
 *  // after promise is fulfilled, obj is equal to comic json data
 */
function getComicSync(comicId, assignmentObj) {
  getComic(comicId).then((data) => {
    console.log(data);
    Object.assign(assignmentObj, data);
  })
}


async function getAndWriteAsync(comicId) {
  fs.open('comics.json');
  const data = await asyncGetComic(comicId);
  fs.write(data);
  fs.close();
}



async function getAllComics() {
  const comics = [];
  for (let i=1; i<3000; i++) {
    try {
      let comic = await getComic(i);
      comics.push(comic);
    } catch(e) {
      console.log(e);
    }

  }
  console.log("all comics retrieved");
  return comics;
}

function getAllComicsSync(assignmentArr) {
  getAllComics().then((res) => {
    Object.assign(assignmentArr, res);
  })
}


async function updateDatabase() {
  // get number of latest comic in database
  const latestQuery = await db.query(`SELECT num FROM (
      SELECT *, 
      LAG(num) OVER (ORDER BY num ASC) AS prev, 
      LEAD(num) OVER (ORDER BY num ASC) as subsequent 
      FROM comics
    ) AS chained_comic
    ORDER BY num DESC LIMIT 1`);
  const latestInDatabase = latestQuery.rows[0].num;

  // set cursor to latest comic number + 1
  let cursor = latestInDatabase + 1;

  // keep going until error on request
  let cont = true;
  while (cont === true) {

    try {
      // try to get comic at cursor
      let comicReq = await axios.get(`https://xkcd.com/${cursor}/info.0.json`);
      let comic = comicReq.data;
      let {num, month, link, year, news, safe_title, transcript, alt, img, title, day} = comic;
      // if successful, write comic to database
      await db.query(`INSERT INTO comics
        (num, month, link, year, news, safe_title, transcript, alt, img, title, day)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
      `, [num, month, link, year, news, safe_title, transcript, alt, img, title, day])

      // increment cursor
      cursor++;
      
    } catch(err) {
      // if unsuccessful, return
      console.log(err);
      cont = false;
      break;
    }
  }

  return cursor-1;
}



module.exports = {logComic, getComic, getComicSync, getAllComics, getAllComicsSync, updateDatabase}
