const { Router } = require("express");
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config.js');

const router = new Router();

/** POST /auth/login
 * 
 * req.body must include username, password
 * authenticate username and password, return 
 * json of token
 */
router.post('/login', async (req, res, next) => {
  try {
    console.log(req.body);
    const {username, password} = req.body;
    const user = await User.authenticate(username, password);
    const token = jwt.sign({id: user.id}, SECRET_KEY)
    return res.json(token);
  } catch(e) {
    return next(e);
  }
})

/** POST auth/signup
 * 
 * uses User.signup by passing it the email, username,
 * and password from the body of the post request, return
 * json of token
 */
router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.signup({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })
    const token = jwt.sign({id: user.id}, SECRET_KEY)
    res.json(token);
  } catch(e) {
    return next(e);
  }
})

module.exports = router;