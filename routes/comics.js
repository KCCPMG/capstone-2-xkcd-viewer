const { Router } = require("express");
const Comic = require('../models/Comic');
const Upvote = require('../models/Upvote');
const Favorite = require('../models/Favorite');
const Controls = require('../models/Controls');

const router = new Router();;

router.get('/', (req, res) => {
  res.json(`comics!\nYour user_id is ${req.user_id}`)
})

/** GET comics/:num
 * 
 * Takes a given number and returns the full comic data,
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
  } catch(e) {
    return next(e);
  }
})


router.post('/upvote/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Upvote.addUpvote(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(201);
    res.json(comic);
  } catch(e) {
    return next(e);
  }
})


router.post('/favorite/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Favorite.addFavorite(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(201);
    res.json(comic);
  } catch(e) {
    return next(e);
  }
})


router.delete('/upvote/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Upvote.removeUpvote(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(200);
    res.json(comic);
  } catch(e) {
    return next(e);
  }
})


router.delete('/favorite/:num', async (req, res, next) => {
  try {
    const comicNum = Number(req.params.num);
    await Favorite.removeFavorite(req.user_id, comicNum);
    const comic = await Controls.getComicDetails(req.params.num, req.user_id);
    res.status(200);
    res.json(comic);
  } catch(e) {
    return next(e);
  }
})

module.exports = router;