const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');
const authenticateJWT = require('./auth');
process.env.NODE_ENV = "test"


const fakeId = "testy-test-testid";
const testJWT = jwt.sign({id: fakeId}, SECRET_KEY);
const badJWT = "bad-token";

describe("authenticateJWT", function() {

  test("Successfully passes through req.headers", async () => {
    const req = { headers: {token: testJWT} };
    const res = {}
    const next = (err) => {
      expect(err).toBeFalsy();
    } 
    
    authenticateJWT(req, res, next);
    expect(req.user_id).toBe(fakeId);
  })

  test("Successfully rejects bad login through req.headers", async () => {
    const req = { headers: {token: badJWT} };
    const res = {}
    const next = (err) => {
      expect(err).toBeFalsy();
    } 
    
    authenticateJWT(req, res, next);
    expect(req.user_id).toBe(null);
  })


})