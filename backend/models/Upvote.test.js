const db = require("../db.js");
const { signup, getUser} = require("./User.js");
const { addUpvote, removeUpvote, getUpvotesByComic, getUpvotesByUser } = require("./Upvote.js");
process.env.NODE_ENV = "test";


const testUser = {}
const badUser = {}

beforeAll(async() => {
  await Promise.all([
    db.query(`DELETE FROM upvotes`), 
    db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"]),
    db.query(`DELETE FROM users WHERE email=$1`, ["baduser@aol.com"])
  ]);
  const test_user = await signup({
    email: "testuser@gmail.com",
    username: "testuser",
    password: "testpassword"
  });
  const bad_user = await signup({
    email: 'baduser@aol.com',
    username: 'baduser',
    password: 'badpassword'
  });
  Object.assign(testUser, test_user);
  Object.assign(badUser, bad_user);
})

afterAll(async() => {
  await db.query(`DELETE FROM upvotes`);
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


describe("Successfully retrieves upvote by comic number", function() {

  // make sure the like exists from testUser on comic 2000
  beforeAll(async () => {
    try {
      await addUpvote(testUser.id, 2000);
    } catch(e) {
      if (e.message !== "Cannot add upvote as requested, upvote already exists") {
        throw e;
      }
    }
  })

  test("returns with count of 0 for comic with no upvotes", async () => {
    const upvotes = await getUpvotesByComic(1);
    expect(upvotes.count).toBe(0);
  })


  test("returns with count of 1 for comic with 1 upvote", async () => {
    const upvotes = await getUpvotesByComic(2000);
    expect(upvotes.count).toBe(1);
  })


  test("returns with count of 0 for nonexistent comic", async() => {
    const upvotes = await getUpvotesByComic(9999999);
    expect(upvotes.count).toBe(0);
  })


  test("returns with count of 1, upvoted=true for comic with correct user", async () => {
    const upvotes = await getUpvotesByComic(2000, testUser.id);
    expect(upvotes.count).toBe(1);
    expect(upvotes.upvoted).toBe(true);
  })


  test("returns with count of 1, upvoted=false for comic with wrong user", async () => {
    const upvotes = await getUpvotesByComic(2000, badUser.id);
    expect(upvotes.count).toBe(1);
    expect(upvotes.upvoted).toBe(false);
  })

})


describe("retrieves upvotes by user", function() {

  // make sure the like exists from testUser on comic 2000
  beforeAll(async () => {
    try {
      await addUpvote(testUser.id, 2000);
    } catch(e) {
      if (e.message !== "Cannot add upvote as requested, upvote already exists") {
        throw e;
      }
    }
  })

  test("checking testUser will return an array including 2000", async () => {
    const upvotes = await getUpvotesByUser(testUser.id);
    expect(upvotes).toBeInstanceOf(Array);
    expect(upvotes.length).toBe(1);
    expect(upvotes[0]).toBe(2000);
  })


  test("checking badUser will return an empty array", async () => {
    const upvotes = await getUpvotesByUser(badUser.id);
    expect(upvotes).toBeInstanceOf(Array);
    expect(upvotes.length).toBe(0);
  })


  test("checking nonexistent user will return an empty array", async () => {
    const upvotes = await getUpvotesByUser("fake-user-id-string");
    expect(upvotes).toBeInstanceOf(Array);
    expect(upvotes.length).toBe(0);
  })

})