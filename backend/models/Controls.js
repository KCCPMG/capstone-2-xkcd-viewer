const Comic = require('./Comic');
const Favorite = require('./Favorite');
const Upvote = require('./Upvote');
const User = require('./User');

const { BadRequestError, NotFoundError } = require("../expressError.js");

/** Get all details for comic
 * 
 * Given a comicId, get the comic, including a count
 * of all likes and upvotes, and return an object with
 * all of this information
 * If a userId is provided, the return object will also include
 * whether or not that user has liked the comic, and whether or 
 * not they've favorited the comic
 * 
 * Any caught error will be passed on if it is already captured as
 * a BadRequesterror or NotFoundError, otherwise a new
 * BadRequestError will be thrown
 */
const getComicDetails = async (comicNum, userId) => {
  try {
    const [foundComic, upvoteObj, favoriteObj] = await Promise.all([
      Comic.getComic(comicNum),
      Upvote.getUpvotesByComic(comicNum, userId),
      Favorite.getFavoritesByComic(comicNum, userId)
    ])

    const returnObj = Object.assign({}, foundComic);
    returnObj.upvoteCount = upvoteObj.count;
    returnObj.favoriteCount = favoriteObj.count;

    if (userId) {
      returnObj.upvoted = upvoteObj.upvoted;
      returnObj.favorited = favoriteObj.favorited;
    }

    return returnObj;

  } catch(e) {
    console.log(e);
    throw(e);
  }
}




module.exports = { getComicDetails }