const db = require('../db.js');
const { BadRequestError, NotFoundError } = require("../expressError.js");

/** Add an upvote from a userid and a comicNum, returns
 * the upvote
 * 
 * Need to make sure that that user and comic exist,
 * and that no upvote for these already exists
 * 
 * If user or comic not found, throws a NotFoundError
 * If upvote already exists, throws a BadRequestError
 * Any other uncaught error throws a BadRequestError
 */
const addUpvote = async (userId, comicNum) => {
  try {
    const checkUser = db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    const checkComic = db.query(`SELECT * FROM comics WHERE num=$1`, [comicNum]);
    const checkUpvote = db.query(`SELECT * FROM upvotes WHERE user_id=$1 AND comic_num=$2`, [userId, comicNum]);
    const [user, comic, duplicateUpvote] = await Promise.all([checkUser, checkComic, checkUpvote]);
    if (user.rows.length < 1) throw new NotFoundError("Cannot add upvote as requested, user not found");
    if (comic.rows.length < 1) throw new NotFoundError("Cannot add upvote as requested, comic not found");
    if (duplicateUpvote.rows.length > 0) throw new BadRequestError("Cannot add upvote as requested, upvote already exists");
    
    // else
    const upvoteQuery = await db.query(`INSERT INTO upvotes (user_id, comic_num) 
    VALUES ($1, $2) 
    RETURNING user_id, comic_num`, 
    [userId, comicNum]);
    return upvoteQuery.rows[0];
    
  } catch(e) {
    if (e instanceof NotFoundError || e instanceof BadRequestError) throw e;
    else throw new BadRequestError();
  }

}


/** Removes an upvote from a userId and a comicNum, returns
 * the removed upvote
 * 
 * Need to make sure that the upvote exists
 * 
 * If the upvote does not exist, throw NotFoundError
 * Any other error throws a BadRequestError
 */
const removeUpvote = async (userId, comicNum) => {
  try {
    const deleteQuery = await db.query(`DELETE FROM upvotes 
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


/** Get upvotes by a comicNum
 * 
 * Takes a comicNum, and a userId (can be null)
 * Returns an object with the count of likes 
 * on a given comic, and if a userId is provided,
 * a boolean as to whether or not that user has
 * upvoted the comic
 * 
 */
const getUpvotesByComic = async (comicNum, userId) => {
  try {
    const upvoteQuery = await db.query(`SELECT * FROM upvotes WHERE comic_num=$1`, [comicNum]);

    const retObj = {
      count: upvoteQuery.rows.length
    }

    if (userId) {
      retObj.upvoted = upvoteQuery.rows.some(row => row.user_id === userId)
    } 

    return retObj;

  } catch(e) {
    throw e;
  }
}


/** Given a userId, returns all comicIds liked by the user */
const getUpvotesByUser = async (userId) => {
  try {
    const upvoteQuery = await db.query(`SELECT comic_num FROM upvotes WHERE user_id=$1`, [userId]);
    return upvoteQuery.rows.map(row => row.comic_num); // array of integers instead of objects
  } catch(e) {
    throw(e);
  }
}



module.exports = { addUpvote, removeUpvote, getUpvotesByUser, getUpvotesByComic }