const db = require("../db.js");
const { v4: uuidv4 } = require('uuid');
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError.js");
const bcrypt = require('bcrypt');


// error message strings
const DUPLICATE_EMAIL="Could not register user, an account already exists with this email address";
const DUPLICATE_USERNAME="Could not register user, an account already exists with this username";
const INVALID_EMAIL="Could not register user, invalid email address";
const INCOMPLETE_USER="Could not register user, please complete all fields";
const SHORT_EMAIL="Could not register user, email address must be at least 6 characters";
const INVALID_USERNAME="Could not register user, username can only contain letters and numbers";
const SHORT_USERNAME="Could not register user, username must be at least 6 characters";


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
  } catch(err) {
    if (err instanceof NotFoundError) throw err;
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

  } catch(err) {
    console.log(err.message, userObj);
    if (err.message==="duplicate key value violates unique constraint \"users_email_key\"") {
      throw new BadRequestError(DUPLICATE_EMAIL);
    } else if (err.message==="duplicate key value violates unique constraint \"users_username_key\"") {
      throw new BadRequestError(DUPLICATE_USERNAME);
    } else if (err.message==="new row for relation \"users\" violates check constraint \"email_address\"") {
      throw new BadRequestError(INVALID_EMAIL);
    } else if (err.message==="new row for relation \"users\" violates check constraint \"email_length\"") {
      throw new BadRequestError(SHORT_EMAIL);
    } else if (err.message==="new row for relation \"users\" violates check constraint \"username_chars\"") {
      throw new BadRequestError(INVALID_USERNAME);
    } else if (err.message==="new row for relation \"users\" violates check constraint \"username_length\"") {
      throw new BadRequestError(SHORT_USERNAME);
    } else if (err.message==="data and salt arguments required") {
      throw new BadRequestError(INCOMPLETE_USER)    
    } else throw new BadRequestError("Bad Request, please check input, make sure to avoid duplication");
  }

}

/** Authenticats a username and password, returns user
 * 
 * if a check fails, an UnauthorizedError is thrown
 */
const authenticate = async(username, password) => {
  try {
    const userQuery = await db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    const foundUser = userQuery.rows[0]
    const check = await bcrypt.compare(password, foundUser.hashed_password);
    if (check) return foundUser;
    else throw new UnauthorizedError();
  } catch(err) {
    throw new UnauthorizedError();
  }

}

// stub, to be developed later
const editUser = async() => {

}

module.exports = {getUser, signup, authenticate, editUser}