const db = require('../db.js');
const { BadRequestError, NotFoundError } = require("../expressError.js");


/** Return a comic
 * 
 * Given an integer (num), returns the appropriate
 * comic from the database that has that num,
 * including the id of the prior and next comics
 * If a comic is not found, throw a NotFoundError
 * Any other error will throw a BadRequestError
 */
const getComic = async (num) => {
  try {
    const result = await db.query(
      `SELECT * FROM (
        SELECT *, 
        LAG(num) OVER (ORDER BY num ASC) AS prev, 
        LEAD(num) OVER (ORDER BY num ASC) as subsequent 
        FROM comics
        ) AS chained_comic
        WHERE num=$1`, [num]);
    if (result.rows.length === 1) return result.rows[0];
    else throw new NotFoundError("Could not find this comic, please check your input");

  } catch(err) {
    if (err instanceof NotFoundError) throw err;
    else throw new BadRequestError(`Bad Request Error: ${err.message}`)
  }
}


/** Returns latest comic
 * 
 * Finds and returns the most recent comic, 
 * including the id of the prior comic
 */
const getLastComic = async (num) => {
  try {
    const result = await db.query(
      `SELECT * FROM (
        SELECT *, 
        LAG(num) OVER (ORDER BY num ASC) AS prev, 
        LEAD(num) OVER (ORDER BY num ASC) as subsequent 
        FROM comics
      ) AS chained_comic
      ORDER BY num DESC LIMIT 1`);
    if (result.rows.length === 1) return result.rows[0];
    else throw new NotFoundError("Could not find this comic, please check your input");

  } catch(err) {
    if (err instanceof NotFoundError) throw err;
    else throw new BadRequestError(`Bad Request Error: ${err.message}`)
  }
}

/** Returns first comic
 * 
 * Finds the earliest comic, including the 
 * id of the next comic
 */
const getFirstComic = async () => {
  try {
    const result = await db.query(
      `SELECT * FROM (
        SELECT *, 
        LAG(num) OVER (ORDER BY num ASC) AS prev, 
        LEAD(num) OVER (ORDER BY num ASC) as subsequent 
        FROM comics
      ) AS chained_comic
      ORDER BY num ASC LIMIT 1`);
    if (result.rows.length === 1) return result.rows[0];
    else throw new NotFoundError("Could not find this comic, please check your input");

  } catch(err) {
    if (err instanceof NotFoundError) throw err;
    else throw new BadRequestError(`Bad Request Error: ${err.message}`)
  }
}

/** Return random comic
 * 
 * Finds and returns a random comic, including the 
 * ids of the prior and next comics
 */
const getRandomComic = async () => {
  try {
    const result = await db.query(`
      SELECT * FROM  (
        SELECT *, 
        LAG(num) OVER (ORDER BY num ASC) AS prev, 
        LEAD(num) OVER (ORDER BY num ASC) as subsequent 
        FROM comics
      ) AS chained_comic
      ORDER BY RANDOM() LIMIT 1;
    `)
    if (result.rows.length === 1) return result.rows[0];
    else throw new NotFoundError("Could not find this comic, please check your input");
  } catch(err) {
    if (err instanceof NotFoundError) throw err;
    else throw new BadRequestError(`Bad Request Error: ${err.message}`)
  }
}

/** Takes a comic object and inserts it into comics table */
const addComic = async (comic) => {
  try {
    const {num, month, link, year, news, safe_title, transcript, alt, img, title, day} = comic;
    const query = await db.query(`INSERT INTO comics (
      num, month, link, year, news, safe_title, transcript, alt, img, title, day
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING num, month, link, year, news, safe_title, transcript, alt, img, title, day`, 
    [num, month, link, year, news, safe_title, transcript, alt, img, title, day])
    if (query.rows.length === 1) {
      return query.rows[0];
    } else {
      throw new BadRequestError("Bad Request: Could not create comic, please check your input");
    }
  } catch(e) {
    throw new BadRequestError("Bad Request: Could not create comic, please check your input");
  }
}



module.exports = {getComic, getLastComic, getFirstComic, getRandomComic, addComic}