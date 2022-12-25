const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config.js');

/** Middleware: Authenticate user by checking token
 * 
 * If token, verify, add user_id to req
 * Whether token or not, call next 
 */
function authenticateJWT(req, res, next) {
  try {
    req.user_id = null;
    if (req.headers.token) {
      req.user_id = jwt.verify(req.headers.token, SECRET_KEY).id;
    }
    return next();
  } catch(e) {
    console.log(e);
    return next();
  }
}

module.exports = authenticateJWT;