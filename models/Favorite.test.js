const db = require("../db.js");
const { signup, getUser} = require("./User.js");
const { addFavorite, removeFavorite } = require("./Favorite.js");
process.env.NODE_ENV = "test";


const testUser = {}

beforeAll(async() => {
  await Promise.all([
    db.query(`DELETE FROM favorites`),
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
  await db.query(`DELETE FROM favorites`);
  await db.end();
})

describe("Successfully adds a favorite", function() {
  
  test("successfully adds and returns a favorite", async () => {
    const favorite = await addFavorite(testUser.id, 2000);
    expect(favorite.user_id).toBe(testUser.id);
    expect(favorite.comic_num).toBe(2000);
    const checkFavoriteQuery = await db.query(`SELECT * FROM favorites WHERE user_id=$1 AND comic_num=$2`, [testUser.id, 2000]);
    expect(checkFavoriteQuery.rows.length).toBe(1);
    expect(checkFavoriteQuery.rows[0].user_id).toBe(testUser.id);
    expect(checkFavoriteQuery.rows[0].comic_num).toBe(2000);
  })


  test("rejects with NotFound for bad user", async() => {
    await expect(addFavorite(1000, 2000)).rejects.toThrow("Cannot favorite as requested, user not found");
  })


  test("rejects with NotFound for bad comic", async() => {
    await expect(addFavorite(testUser.id, 1000000)).rejects.toThrow("Cannot favorite as requested, comic not found");
  })


  test("rejects when a favorite has already been added", async () => {
    await db.query(`DELETE FROM favorites`);
    const favorite = await addFavorite(testUser.id, 2000);
    await expect(addFavorite(testUser.id, 2000)).rejects.toThrow("Cannot favorite as requested, comic already favorited");
  })

})


describe("Successfully deletes a favorite", function() {

  beforeEach(async() => {
    await Promise.all([
      db.query(`DELETE FROM favorites`),
      addFavorite(testUser.id, 2000)
    ])
  })

  test("successfully deletes a favorite", async() => {
    const removeQuery = await removeFavorite(testUser.id, 2000);
    expect(removeQuery.user_id).toBe(testUser.id);
    expect(removeQuery.comic_num).toBe(2000);
  })


  test("rejects with NotFound with bad user", async() => {
    await expect(removeFavorite(1000, 2000)).rejects.toThrow("No rows deleted")
  })


  test("rejects with NotFound with bad comic", async() => {
    await expect(removeFavorite(testUser.id, 10000000)).rejects.toThrow("No rows deleted")
  })


  test("rejects with NotFound with wrong comic", async() => {
    await expect(removeFavorite(testUser.id, 1)).rejects.toThrow("No rows deleted")
  })


})