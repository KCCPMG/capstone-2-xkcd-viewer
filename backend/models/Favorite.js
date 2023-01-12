const db = require('../db.js');
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError.js");


/** Add a favorite from a userid and a comicNum, returns
 * the favorite
 * 
 * Need to make sure that that user and comic exist,
 * and that this user does not already have this comic 
 * favorited
 * 
 * If no user, throws an UnauthorizedError
 * If user or comic not found, throws a NotFoundError
 * If favorite already exists, throws a BadRequestError
 * Any other uncaught error throws a BadRequestError
 */
const addFavorite = async (userId, comicNum) => {
  try {
    if (!userId) throw new UnauthorizedError();
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

  } catch(err) {
    if (err instanceof UnauthorizedError) throw err;
    else if (err instanceof NotFoundError || err instanceof BadRequestError) throw err;
    else throw new BadRequestError();
  }
}



/** Removes a favorite from a userId and a comicNum, returns
 * the removed favorite
 * 
 * Need to make sure that the favorite exists
 * 
 * If no user, throws an UnauthorizedError
 * If the favorite does not exist, throw NotFoundError
 * Any other error throws a BadRequestError
 */
const removeFavorite = async (userId, comicNum) => {
  try {
    if (!userId) throw new UnauthorizedError();
    const deleteQuery = await db.query(`DELETE FROM favorites 
      WHERE user_id=$1 AND comic_num=$2
      RETURNING *`, 
    [userId, comicNum]);
    if (deleteQuery.rows.length===0) throw new NotFoundError("No rows deleted")
    else return deleteQuery.rows[0];
  } catch(err) {
    if (err instanceof UnauthorizedError) throw err;
    else if (err instanceof NotFoundError) throw err;
    throw new BadRequestError();
  }
}

/** Given a userId, returns all comicIds favorited by the user
 * If no user, throws an UnauthorizedError
 */
getFavoritesByUser = async (userId) => {
  try {
    if (!userId) throw new UnauthorizedError();
    const favoritesQuery = await db.query(`SELECT comic_num FROM favorites WHERE user_id=$1`, [userId]);
    return favoritesQuery.rows.map(row => row.comic_num) // array of integers instead of objects
  } catch(err) {
    if (err instanceof UnauthorizedError) throw err;
    else throw new BadRequestError();
  } 
}


/** Get favorites by a comicNum
 * 
 * Takes a comicNum, and a userId (can be null)
 * Returns an object with the count of favorites
 * on a given comic, and if a userId is provided,
 * a boolean as to whether or not that user has 
 * upvoted the comic
 */
getFavoritesByComic = async (comicNum, userId) => {
  try {
    const favoriteQuery = await db.query(`SELECT * FROM favorites WHERE comic_num=$1`, [comicNum]);

    const retObj = {
      count: favoriteQuery.rows.length
    }

    if (userId) {
      retObj.favorited = favoriteQuery.rows.some(row => row.user_id === userId)
    } 

    return retObj;

  } catch(err) {
    throw new BadRequestError();
  }
}

module.exports = { addFavorite, removeFavorite, getFavoritesByUser, getFavoritesByComic }