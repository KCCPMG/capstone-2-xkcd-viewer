const db = require('../db.js');
const { BadRequestError, NotFoundError } = require("../expressError.js");


/** Add a favorite from a userid and a comicNum, returns
 * the favorite
 * 
 * Need to make sure that that user and comic exist,
 * and that this user does not already have this comic 
 * favorited
 * 
 * If user or comic not found, throws a NotFoundError
 * If favorite already exists, throws a BadRequestError
 * Any other uncaught error throws a BadRequestError
 */
const addFavorite = async (userId, comicNum) => {
  try {
    const checkUser = db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    const checkComic = db.query(`SELECT * FROM comics WHERE num=$1`, [comicNum]);
    const checkFavorite = db.query(`SELECT * FROM favorites WHERE user_id=$1 AND comic_num=$2`, [userId, comicNum]);
    const [user, comic, duplicateFavorite] = await Promise.all([checkUser, checkComic, checkFavorite]);
    if (user.rows.length < 1) throw new NotFoundError("Cannot favorite as requested, user not found");
    if (comic.rows.length < 1) throw new NotFoundError("Cannot favorite as requested, comic not found");
    if (duplicateFavorite.rows.length > 0) throw new BadRequestError("Cannot favorite as requested, comic already favorited");
    
    // else
    const favoriteQuery = await db.query(`INSERT INTO favorites (user_id, comic_num) 
    VALUES ($1, $2) 
    RETURNING user_id, comic_num`, 
    [userId, comicNum]);
    return favoriteQuery.rows[0];

  } catch(e) {
    if (e instanceof NotFoundError || e instanceof BadRequestError) throw e;
    else throw new BadRequestError();
  }
}



/** Removes a favorite from a userId and a comicNum, returns
 * the removed favorite
 * 
 * Need to make sure that the favorite exists
 * 
 * If the favorite does not exist, throw NotFoundError
 * Any other error throws a BadRequestError
 */
const removeFavorite = async (userId, comicNum) => {
  try {
    const deleteQuery = await db.query(`DELETE FROM favorites 
      WHERE user_id=$1 AND comic_num=$2
      RETURNING *`, 
    [userId, comicNum]);
    if (deleteQuery.rows.length===0) throw new NotFoundError("No rows deleted")
    else return deleteQuery.rows[0];
  } catch(e) {
    if (e instanceof NotFoundError) throw e;
    throw new BadRequestError();
  }
}


module.exports = { addFavorite, removeFavorite }