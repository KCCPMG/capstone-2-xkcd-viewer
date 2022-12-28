process.env.NODE_ENV="test";
const db = require("../db");
const request = require('supertest');
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config.js');

const app = require('../app');

const testUser = {}
beforeAll(async () => {
  db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"])
  let newUser = await User.signup({
    email: "testuser@gmail.com",
    username: "testuser",
    password: "testpassword"
  })
  Object.assign(testUser, newUser);
})

afterAll(async () => {
  await db.end();
})



describe("POST /auth/signup", function() {

})

describe("POST /auth/login", function() {
  test("successfully logs in with correct credentials", async () => {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        "username": testUser.username,
        "password": "testpassword"
      });
    expect(resp.statusCode).toBe(200);
    const token = resp.body;
    expect(jwt.verify(token, SECRET_KEY).id).toBe(testUser.id);
  })
})
