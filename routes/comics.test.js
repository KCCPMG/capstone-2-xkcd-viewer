process.env.NODE_ENV="test";
const db = require("../db");
const request = require('supertest');
const User = require("../models/User");
const Upvote = require("../models/Upvote");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config.js');

const app = require('../app');

const testUser = {}
beforeAll(async () => {
  db.query(`DELETE FROM upvotes`);
  db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"]);
  db.query(`DELETE FROM users WHERE email=$1`, ["secondtestuser@gmail.com"]);
  let newUser = await User.signup({
    email: "testuser@gmail.com",
    username: "testuser",
    password: "testpassword"
  })
  Object.assign(testUser, newUser);
  testUser.token = jwt.sign({id: newUser.id}, SECRET_KEY);
})

afterAll(async () => {
  await db.end();
})

describe("GET /comics/:num", function() {

  test("successfully retrieves a comic (no user)", async () => {
    const resp = await request(app)
      .get('/comics/1')

    expect(resp.body.num).toBe(1);
    expect(resp.body.year).toBe("2006");
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]")
    expect(resp.body).not.toHaveProperty('upvoted');
    expect(resp.body).not.toHaveProperty('favorited');
    
  })

  test("successfully retrieves a comic (with user)", async () => {
    const resp = await request(app)
      .get('/comics/1')
      .set('token', testUser.token)
    expect(resp.body.num).toBe(1);
    expect(resp.body.year).toBe("2006");
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]")
    expect(resp.body).toHaveProperty('upvoted');
    expect(resp.body).toHaveProperty('favorited');
    expect(resp.body.upvoteCount).toBe(0);
    expect(resp.body.favoriteCount).toBe(0);
    expect(resp.body.upvoted).toBe(false);
    expect(resp.body.favorited).toBe(false);
  })

  test("successfully retrieves a comic that has been upvoted (with user)", async () => {
    await Upvote.addUpvote(testUser.id, 1);
    const resp = await request(app)
      .get('/comics/1')
      .set('token', testUser.token)
    expect(resp.body.num).toBe(1);
    expect(resp.body.year).toBe("2006");
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]")
    expect(resp.body).toHaveProperty('upvoted');
    expect(resp.body).toHaveProperty('favorited');
    expect(resp.body.upvoteCount).toBe(1);
    expect(resp.body.favoriteCount).toBe(0);
    expect(resp.body.upvoted).toBe(true);
    expect(resp.body.favorited).toBe(false);
  })

  test("throws NotFoundError for no comic", async () => {
    const resp = await request(app)
      .get('/comics/999999')
    expect(resp.statusCode).toBe(404);
    expect(resp.body.error.message).toBe("Could not find this comic, please check your input");
  })

})