const db = require("../db.js");
const { BadRequestError } = require("../expressError.js");
const { signup, getUser} = require("./User.js");
const { addUpvote, removeUpvote } = require("./Upvote.js");
process.env.NODE_ENV = "test";


const testUser = {}

beforeAll(async() => {
  await Promise.all([
    db.query(`DELETE FROM upvotes`), 
    db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"])
  ]);
  const newUser = await signup({
    email: "testuser@gmail.com",
    username: "testuser",
    password: "testpassword"
  })
  Object.assign(testUser, newUser);
})

afterAll(async() => {
  await db.end();
})


describe("Successfully adds an upvote", function(){

  test("successfully adds and returns an upvote", async () => {
    const upvote = await addUpvote(testUser.id, 2000);
    expect(upvote.user_id).toBe(testUser.id);
    expect(upvote.comic_num).toBe(2000);
    const checkUpvoteQuery = await db.query(`SELECT * FROM upvotes WHERE user_id=$1 AND comic_num=$2`, [testUser.id, 2000]);
    expect(checkUpvoteQuery.rows.length).toBe(1);
    expect(checkUpvoteQuery.rows[0].user_id).toBe(testUser.id);
    expect(checkUpvoteQuery.rows[0].comic_num).toBe(2000);
  })


  test("rejects with NotFound for bad user", async() => {
    await expect(addUpvote(1000, 2000)).rejects.toThrow("Cannot add upvote as requested, user not found");
  })


  test("rejects with NotFound for bad comic", async() => {
    await expect(addUpvote(testUser.id, 1000000)).rejects.toThrow("Cannot add upvote as requested, comic not found");
  })


  test("rejects when an upvote has already been added", async () => {
    await db.query(`DELETE FROM upvotes`);
    const upvote = await addUpvote(testUser.id, 2000);
    await expect(addUpvote(testUser.id, 2000)).rejects.toThrow("Cannot add upvote as requested, upvote already exists");
  })

})


describe("Successfully deletes an upvote", function() {

  beforeEach(async() => { 
    await Promise.all([
      db.query(`DELETE FROM upvotes`),
      addUpvote(testUser.id, 2000)
    ]);
   })

  test("successfully deletes an upvote", async() => {
    const removeQuery = await removeUpvote(testUser.id, 2000);
    expect(removeQuery.user_id).toBe(testUser.id);
    expect(removeQuery.comic_num).toBe(2000);
  })


  test("rejects with NotFound with bad user", async() => {
    await expect(removeUpvote(1000, 2000)).rejects.toThrow("No rows deleted")
  })


  test("rejects with NotFound with bad comic", async() => {
    await expect(removeUpvote(testUser.id, 10000000)).rejects.toThrow("No rows deleted")
  })


  test("rejects with NotFound with wrong comic", async() => {
    await expect(removeUpvote(testUser.id, 1)).rejects.toThrow("No rows deleted")
  })
})