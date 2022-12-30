/**
 * Various helper functions to help collect comics data to put 
 * into 'comics.json'
 * 'comics.json' will then be used to populate the comics table
 * These functions were mainly used in the node replit to get the 
 * data, then write comics.json 
 */


const axios = require('axios');
const fs = require('fs');

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


module.exports = {logComic, getComic, getComicSync, getAllComics, getAllComicsSync}
