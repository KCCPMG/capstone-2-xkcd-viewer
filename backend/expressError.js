
/** Express Error to give latitude for message and status
 * 
 * Base class to be extended for particular cases to call
 * depending on circumstances of error
 */
class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}


/** Bad Request Error to handle bad requests
 * 
 * Bad requests can involve an attempt to create a record
 * which conflits with an existing one, or incomplete information
 * for a given database operation
 * 
 * Unless given an explicit message argument, message defaults to 
 * "Bad Request"
 * 
 * Status will always be 400
 */
class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/** Not Found Error to handle unfound resources, 404
 * 
 * Unless given an explicit message argument, message defaults to 
 * "Not Found"
 * 
 * Status will always be 404
 */
class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}


/** Unauthorized Error to handle bad login
 * 
 * Unless given an explicit message argument, message defaults to
 * "Invalid credentials, please try again"
 * 
 * Status will always be 401
 */
class UnauthorizedError extends ExpressError {
  constructor(message="Invalid credentials, please try again") {
    super(message, 401);
  }
}

module.exports = {BadRequestError, NotFoundError, UnauthorizedError}