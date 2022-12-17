const db = require('../db.js');
const { BadRequestError, NotFoundError } = require("../expressError.js");

/** Add an upvote from a userid and a comicNum
 * 
 * Need to make sure that that user and comic exist,
 * and that no upvote for these already exists
 * 
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
    else throw new BadRequestError(e.message);
  }

}


/**
 * 
 */
const removeUpvote = async (userid, comicNum) => {
  await db.query(``)
}


module.exports = { addUpvote, removeUpvote}