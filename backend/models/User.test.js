const db = require("../db.js");
const { BadRequestError } = require("../expressError.js");
const { signup, getUser, authenticate } = require("./User.js");
process.env.NODE_ENV = "test";


const newUser = {
  email: "test@email.com",
  username: "testuser",
  password: "password123"
}

beforeEach(async() => {
  await db.query(`DELETE FROM users WHERE username=$1;`, [newUser.username])
  const clearQuery = await db.query(`SELECT * FROM users WHERE username=$1;`, [newUser.username])
  console.log(clearQuery.rows);
})
afterEach(async() => {
  await db.query(`DELETE FROM users WHERE username=$1;`, [newUser.username])
  const clearQuery = await db.query(`SELECT * FROM users WHERE username=$1;`, [newUser.username])
  // console.log(clearQuery.rows);
})
afterAll(async () => await db.end());


describe("Testing signup", function(){

  test("signup adds new user", async function(){

    const newSavedUser = await signup(newUser);
    // console.log(newSavedUser);
    expect(newSavedUser.email).toBe(newUser.email);
    expect(newSavedUser.username).toBe(newUser.username);
    expect(newSavedUser.password).toBeUndefined();
    expect(newSavedUser.hashed_password).toBeDefined();
    expect(newSavedUser.id).toBeDefined();
    
  })

  test("signup with existing email throws BadRequestError", async function() {
    await signup(newUser);
    await expect(signup(newUser)).rejects.toThrow("Could not register user, an account already exists with this email")
  })


  test("signup with existing username throws BadRequestError", async function() {
    // email different, username the same
    const duplicateUser = Object.assign({}, newUser, {email: "uniqueemail@soandso.com"})
    await signup(newUser);
    await expect(signup(duplicateUser)).rejects.toThrow("Could not register user, an account already exists with this username")
  })


  test("signup with missing data throws BadRequestError", async function() {
    const badUser = {
      firstName: "Charles"
    }
    await expect(signup(badUser)).rejects.toThrow("Could not register user, please complete all fields");
  })


  test("signup with invalid email address throws BadRequestError", async function() {
    const badUser = {
      email: "invalid",
      username: "invaliduser",
      password: "password"
    }
    await expect(signup(badUser)).rejects.toThrow("Could not register user, invalid email address")
  })

})


describe("Testing get", function(){

  test("should return correct user", async function(){
    const newSavedUser = await signup(newUser);
    const gottenUser = await getUser(newSavedUser.id);
    expect(gottenUser.email).toBe(newUser.email);
    expect(gottenUser.username).toBe(newUser.username);
    expect(gottenUser.password).toBeUndefined();
    expect(gottenUser.hashed_password).toBeUndefined();
    expect(gottenUser.id).toBeDefined();
  })


  test("should return not found for nonexistent user", async function(){
    await expect(getUser('wrongid')).rejects.toThrow("User not found.");
  })


})


describe("Testing authenticate", function(){

  test("should return the correct user with correct username/password", async function() {
    const newSavedUser = await signup(newUser);
    const authenticatedUser = await authenticate(newUser.username, newUser.password);
    expect(authenticatedUser.email).toBe(newUser.email);
    expect(authenticatedUser.username).toBe(newUser.username);
    expect(authenticatedUser.password).toBeUndefined();
    expect(authenticatedUser.hashed_password).toBeDefined();
    expect(authenticatedUser.id).toBeDefined();
  })


  test("should throw an Unauthorized error with incorrect username/password", async function(){
    const newSavedUser = await signup(newUser);
    await expect(authenticate("wrongpassword", newUser.password)).rejects.toThrow("Bad Login");
  })

})


