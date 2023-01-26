const { Router } = require("express");
const Upvote = require('../models/Upvote');
const Favorite = require('../models/Favorite');
const Controls = require('../models/Controls');

const router = new Router();;



/** GET comics/random
 * 
 * Finds a random comic and returns it. If there
 * is a valid user from upstream authentication, 
 * then the returned object says if it
 * was upvoted and/or favorited by the user
 */
router.get('/random', async (req, res, next) => {
  try {
    const comic = await Controls.getRandomComicDetails(req.user_id);
    return res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** GET comics/current
 * 
 * Finds the latest comic and returns it. If there
 * is a valid user from upstream authentication, 
 * then the returned object says if it
 * was upvoted and/or favorited by the user
 */
router.get('/current', async (req, res, next) => {
  try {
    const comic = await Controls.getLastComicDetails(req.user_id);
    return res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** GET comics/favorites
 * 
 * Finds a user's favorite comics and returns them
 * as an array of comic_nums. Authentication is handled
 * upstream, and access without a valid user will throw
 * the error thrown by Favorite.getFavoritesByUser
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const favorites = await Favorite.getFavoritesByUser(req.user_id);
    return res.json(favorites);
  } catch(err) {
    return next(err);
  }
})

/** GET comics/popular
 * 
 * Regardless of user, finds all comics that have
 * been upvoted, and returns them as an array of 
 * comic_nums in descending order of upvotes per
 * comic.
 */
router.get('/popular', async (req, res, next) => {
  try {
    const upvoted = await Upvote.getMostUpvoted(req.user_id);
    return res.json(upvoted);
  } catch(err) {
    return next(err);
  }
})

/** GET comics/:num
 * 
 * Takes a given comic number and returns the full comic data,
 * including a count of upvotes and favorites
 * Token authentication happens upstream, so if there is 
 * a valid user_id on the request, the returned object
 * will also have true or false for whether this user has
 * liked/upvoted
 * An invalid comic number should throw a NotFoundError
 */
router.get('/:num', async (req, res, next) => {
  try {
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    return res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** POST comics/upvote/:num
 * 
 * Adds an upvote to a given comic_num from a user. Upstream
 * token authentication will validate the user. A
 * missing/invalid user will throw an UnauthorizedError,
 * and an invalid comic_num will throw a NotFoundError.
 * Returns the full comic after having been upvoted.
 */
router.post('/upvote/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Upvote.addUpvote(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(201);
    res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** POST comics/favorite/:num
 * 
 * Adds a favorite to a given comic_num from a user. Upstream
 * token authentication will validate the user. A
 * missing/invalid user will throw an UnauthorizedError,
 * and an invalid comic_num will throw a NotFoundError.
 * Returns the full comic after having been favorited.
 */
router.post('/favorite/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Favorite.addFavorite(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(201);
    res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** DELETE comics/upvote/:num
 * 
 * Removes an upvote from a given comic_num from a user. Upstream
 * token authentication will validate the user. A
 * missing/invalid user will throw an UnauthorizedError,
 * and an invalid comic_num will throw a NotFoundError.
 * Returns the full comic after deleting the upvote.
 */
router.delete('/upvote/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Upvote.removeUpvote(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(200);
    res.json(comic);
  } catch(err) {
    return next(err);
  }
})

/** DELETE comics/favorite/:num
 * 
 * Removes a favorite from a given comic_num from a user. 
 * Upstream token authentication will validate the user. A
 * missing/invalid user will throw an UnauthorizedError,
 * and an invalid comic_num will throw a NotFoundError.
 * Returns the full comic after deleting the favorite.
 */
router.delete('/favorite/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Favorite.removeFavorite(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(200);
    res.json(comic);
  } catch(err) {
    return next(err);
  }
})

module.exports = router;