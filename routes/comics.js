const { Router } = require("express");
const Comic = require('../models/Comic');

const router = new Router();;

router.get('/', (req, res) => {
  res.json(`comics!\nYour user_id is ${req.user_id}`)
})

router.get('/:num', async (req, res, next) => {
  try {
    const comic = await Comic.getComic(req.params.num);
    return res.json(comic);
  } catch(e) {
    return next(e);
  }
})

module.exports = router;