const db = require('../db.js');

const getComic = async (num) => {
  try {
    const result = await db.query(`SELECT * FROM comics WHERE num=$1`, [num]);
    console.log(result.rows);
    if (result.rows.length === 1) return result.rows[0];
    else return null;

  } catch(e) {
    console.log(e);
    return "Something went wrong. Please check your input."
  }

}


const addComic = async (comic) => {
  try {
    const {num, month, link, year, news, safe_title, transcript, alt, img, title, day} = comic;
    const query = await db.query(`INSERT INTO comics (
      num, month, link, year, news, safe_title, transcript, alt, img, title, day
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    ) RETURNING num, month, link, year, news, safe_title, transcript, alt, img, title, day`, 
    [num, month, link, year, news, safe_title, transcript, alt, img, title, day])
    return query.rows[0];
  } catch(e) {
    console.log(e);
    return "Something went wrong. Please check your input."
  }
}



module.exports = {getComic, addComic}