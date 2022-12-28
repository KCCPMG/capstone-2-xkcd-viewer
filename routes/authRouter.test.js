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
  db.query(`DELETE FROM users WHERE email=$1`, ["secondtestuser@gmail.com"])
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
  
  test("successfully signs up with valid credentials", async () => {
    const resp = await request(app)
      .post('/auth/signup')
      .send({
        email: "secondtestuser@gmail.com",
        username: "secondtestuser",
        password: "secondtestpassword"
      })
    expect(resp.statusCode).toBe(200);
    const token = resp.body;
    expect(jwt.verify(token, SECRET_KEY).id).toBeTruthy();
  })

  test("throws bad request error with duplicate credentials", async () => {
    const resp = await request(app)
      .post('/auth/signup')
      .send({
        email: "secondtestuser@gmail.com",
        username: "secondtestuser",
        password: "secondtestpassword"
      })
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toBe("Bad Request, please check input, make sure to avoid duplication");
  })


  test("throws bad request error with invalid credentials", async () => {
    const resp = await request(app)
      .post('/auth/signup')
      .send({
        email: "secondtestusergmail.com",
        username: "baduser",
        password: "baduserpassword"
      })
    expect(resp.statusCode).toBe(400);
    expect(resp.body.error.message).toBe("Bad Request, please check input, make sure to avoid duplication");
  })




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

  test("successfully throws unauthorized error with wrong credentials", async () => {
    const resp = await request(app)
      .post("/auth/login")
      .send({
        "username": testUser.username,
        "password": "wrong-password"
      })
    expect(resp.statusCode).toBe(401);
    expect(resp.body.error.message).toBe("Bad Login");
  })
})
