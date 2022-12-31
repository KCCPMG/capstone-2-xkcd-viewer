process.env.NODE_ENV="test";
const db = require("../db");
const request = require('supertest');
const User = require("../models/User");
const Upvote = require("../models/Upvote");
const Favorite = require("../models/Favorite");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config.js');

const app = require('../app');

const testUser = {}
beforeAll(async () => {
  await Promise.all([
    db.query(`DELETE FROM favorites`),
    db.query(`DELETE FROM upvotes`)
  ]);
  await Promise.all([
    db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"]),
    db.query(`DELETE FROM users WHERE email=$1`, ["secondtestuser@gmail.com"])
  ]);
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
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]");
    expect(resp.body.prev).toBe(null);
    expect(resp.body.subsequent).toBe(2);
    expect(resp.body).not.toHaveProperty('upvoted');
    expect(resp.body).not.toHaveProperty('favorited');
    
  })

  test("successfully retrieves a comic (with user)", async () => {
    const resp = await request(app)
      .get('/comics/1')
      .set('token', testUser.token)
    expect(resp.body.num).toBe(1);
    expect(resp.body.year).toBe("2006");
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]");
    expect(resp.body.prev).toBe(null);
    expect(resp.body.subsequent).toBe(2);
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
    expect(resp.body.transcript).toContain("[[The barrel drifts into the distance. Nothing else can be seen.]]");
    expect(resp.body.prev).toBe(null);
    expect(resp.body.subsequent).toBe(2);
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


describe("POST /comics/upvote/:num", function () {

  beforeAll(async () => {
    await Promise.all([
      db.query(`DELETE FROM upvotes`),
      db.query(`DELETE FROM favorites`)
    ])
  });

  test("adds upvote to comic with valid comic and user_id", async () => {
    const resp = await request(app)
      .post("/comics/upvote/2000")
      .set('token', testUser.token)
    if (resp.body.error) console.log(resp.body.error);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.upvoteCount).toBe(1);
    expect(resp.body.favoriteCount).toBe(0);
    expect(resp.body.upvoted).toBe(true);
    expect(resp.body.favorited).toBe(false);
  });

  test("throws an error on a duplicate upvote", async () => {
    const resp = await request(app)
      .post("/comics/upvote/2000")
      .set('token', testUser.token)
    expect(resp.statusCode).toBe(400)
    expect(resp.body.error.message).toBe("Cannot add upvote as requested, upvote already exists")
  });

  test("throws a NotFoundError with bad user_id", async () => {
    const badToken = jwt.sign('baduser', SECRET_KEY);
    const resp = await request(app)
      .post("/comics/upvote/2000")
      .set('token', badToken)
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("Cannot add upvote as requested, user not found")
  });

  test("throws a NotFoundError with bad comic", async () => {
    const resp = await request(app)
      .post("/comics/upvote/9999999")
      .set('token', testUser.token)
    if (resp.body.error) console.log(resp.body);
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("Cannot add upvote as requested, comic not found")
  });


})

describe("POST /comics/favorite/:num", function () {

  beforeAll(async () => {
    await Promise.all([
      db.query(`DELETE FROM upvotes`),
      db.query(`DELETE FROM favorites`)
    ]);
    
  });

  test("adds upvote to comic with valid comic and user_id", async () => {
    const resp = await request(app)
      .post("/comics/favorite/2000")
      .set('token', testUser.token)
    if (resp.body.error) console.log(resp.body.error);
    expect(resp.statusCode).toBe(201);
    expect(resp.body.upvoteCount).toBe(0);
    expect(resp.body.favoriteCount).toBe(1);
    expect(resp.body.upvoted).toBe(false);
    expect(resp.body.favorited).toBe(true);
  });

  test("throws an error on a duplicate favorite", async () => {
    const resp = await request(app)
      .post("/comics/favorite/2000")
      .set('token', testUser.token)
    expect(resp.statusCode).toBe(400)
    expect(resp.body.error.message).toBe("Cannot favorite as requested, comic already favorited")
  });

  test("throws a NotFoundError with bad user_id", async () => {
    const badToken = jwt.sign('baduser', SECRET_KEY);
    const resp = await request(app)
      .post("/comics/favorite/2000")
      .set('token', badToken)
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("Cannot favorite as requested, user not found")
  });

  test("throws a NotFoundError with bad comic", async () => {
    const resp = await request(app)
      .post("/comics/favorite/9999999")
      .set('token', testUser.token)
    if (resp.body.error) console.log(resp.body);
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("Cannot favorite as requested, comic not found")
  });

})


describe("DELETE /comics/upvote/:num", function () {

  beforeAll(async () => {
    await Promise.all([
      db.query(`DELETE FROM upvotes`),
      db.query(`DELETE FROM favorites`)
    ]);
    await Upvote.addUpvote(testUser.id, 1000);
  });

  test("successfully deletes an upvote", async () => {
    const resp = await request(app)
      .delete('/comics/upvote/1000')
      .set('token', testUser.token);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.upvoteCount).toBe(0);
    expect(resp.body.favoriteCount).toBe(0);
    expect(resp.body.upvoted).toBe(false);
    expect(resp.body.favorited).toBe(false);
  });

  test("throws a NotFoundError when making an invalid upvote delete", async () => {
    // already deleted
    const resp = await request(app)
      .delete('/comics/upvote/1000')
      .set('token', testUser.token);
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("No rows deleted")
  });

})


describe("DELETE /comics/favorite/:num", function () {

  beforeAll(async () => {
    await Promise.all([
      db.query(`DELETE FROM upvotes`),
      db.query(`DELETE FROM favorites`)
    ])
    await Favorite.addFavorite(testUser.id, 1000);
  });

  test("successfully deletes a favorite", async () => {
    const resp = await request(app)
      .delete('/comics/favorite/1000')
      .set('token', testUser.token);
    expect(resp.statusCode).toBe(200);
    expect(resp.body.upvoteCount).toBe(0);
    expect(resp.body.favoriteCount).toBe(0);
    expect(resp.body.upvoted).toBe(false);
    expect(resp.body.favorited).toBe(false);
  });

  test("throws a NotFoundError when making an invalid favorite delete", async () => {
    const resp = await request(app)
      .delete('/comics/favorite/1000')
      .set('token', testUser.token);
    expect(resp.statusCode).toBe(404)
    expect(resp.body.error.message).toBe("No rows deleted")
  });

})