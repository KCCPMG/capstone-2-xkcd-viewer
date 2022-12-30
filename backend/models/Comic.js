const db = require('../db.js');
const { BadRequestError, NotFoundError } = require("../expressError.js");


/** Return a comic
 * 
 * Given an integer (num), return the appropriate
 * comic from the database that has that num
 * If a comic is not found, throw a NotFoundError
 * Any other error will throw a BadRequestError
 */
const getComic = async (num) => {
  try {
    const result = await db.query(`SELECT * FROM comics WHERE num=$1`, [num]);
    if (result.rows.length === 1) return result.rows[0];
    else throw new NotFoundError("Could not find this comic, please check your input");

  } catch(e) {
    if (e instanceof NotFoundError) throw e;
    else throw new BadRequestError(`Bad Request Error: ${e.message}`)
  }

}


/** Takes a comic object and inserts it into comics table 
 * 
 */
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



module.exports = {getComic, addComic}