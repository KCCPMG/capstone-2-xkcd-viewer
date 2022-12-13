const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

/** Middleware: Authenticate user by checking token
 * 
 * If token 
 */
function authenticateJWT(req, res, next) {
  try {
    req.user_id = null;
    console.log(req.user_id);
    console.log(req.headers);
    if (req.headers.token) {
      req.user_id = jwt.verify(req.headers.token, SECRET_KEY);
    }
    return next();
  } catch(e) {
    return next();
  }
}

module.exports = authenticateJWT;