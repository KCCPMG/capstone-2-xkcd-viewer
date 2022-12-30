const db = require("../db.js");
const { v4: uuidv4 } = require('uuid');
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError.js");
const bcrypt = require('bcrypt');

/** Get a saved user
 * 
 * Takes an id, searches users table and returns document
 * Does NOT return hashed_password in document object
 * Does not return from upvotes or favorites tables
 */
const getUser = async(id) => {
  try {
    const getQuery = await db.query(`SELECT id, username, email, created_at FROM users WHERE id=$1`, [id]);
    if (getQuery.rows.length === 0) {
      throw new NotFoundError("User not found.");
    } else {
      return getQuery.rows[0];
    }
  } catch(e) {
    if (e instanceof NotFoundError) throw e;
    else throw new BadRequestError();
  }
}

/** Sign up a new user
 * 
 * takes userObj (email, username, password)
 * checks email for if this user already exists, if so throws error
 * otherwise hashes password, creates unique id, 
 * inserts new user into table
 */
const signup = async(userObj) => {
  try {

    const hashed_pasword = await bcrypt.hash(userObj.password, BCRYPT_WORK_FACTOR);
    const id = uuidv4();
    const {email, username} = userObj;

    const signupQuery = await db.query(`INSERT INTO users 
      (id, email, username, hashed_password, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, email, username, hashed_password, created_at;
    `, [id, email, username, hashed_pasword]);

    return signupQuery.rows[0];


  } catch(e) {
    // console.log(e);
    throw new BadRequestError("Bad Request, please check input, make sure to avoid duplication");
  }

}

/** Authenticats a username and password, returns user
 * 
 * if a check fails, an UnauthorizedError is thrown
 */
const authenticate = async(username, password) => {
  try {
    const userQuery = await db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    // console.log(userQuery);
    const foundUser = userQuery.rows[0]
    // console.log(foundUser);
    const check = await bcrypt.compare(password, foundUser.hashed_password);
    if (check) return foundUser;
    else throw new UnauthorizedError();
  } catch(e) {
    // console.log(e);
    throw new UnauthorizedError();
  }

}

// stub, to be developed later
const editUser = async() => {

}

module.exports = {getUser, signup, authenticate, editUser}