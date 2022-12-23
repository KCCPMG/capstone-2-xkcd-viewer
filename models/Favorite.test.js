const db = require("../db.js");
const { signup, getUser} = require("./User.js");
const { addFavorite, removeFavorite, getFavoritesByComic, getFavoritesByUser } = require("./Favorite.js");
process.env.NODE_ENV = "test";


const testUser = {}
const badUser = {}

beforeAll(async() => {
  await Promise.all([
    db.query(`DELETE FROM favorites`),
    db.query(`DELETE FROM users WHERE email=$1`, ["testuser@gmail.com"]),
    db.query(`DELETE FROM users WHERE email=$1`, ["baduser@aol.com"])
  ]);
  const newUser = await signup({
    email: "testuser@gmail.com",
    username: "testuser",
    password: "testpassword"
  });
  const bad_user = await signup({
    email: 'baduser@aol.com',
    username: 'baduser',
    password: 'badpassword'
  });
  Object.assign(testUser, newUser);
  Object.assign(badUser, bad_user);
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


describe("Successfully retrieves favorites by comic number", function() {

  // make sure the like exists from testUser on comic 2000
  beforeAll(async () => {
    try {
      await addFavorite(testUser.id, 2000);
    } catch(e) {
      if (e.message !== "Cannot favorite as requested, comic already favorited") {
        throw e;
      }
    }
  })

  test("returns with count of 0 for comic with no favorites", async () => {
    const favorites = await getFavoritesByComic(1);
    expect(favorites.count).toBe(0);
  })


  test("returns with count of 1 for comic with 1 favorite", async () => {
    const favorites = await getFavoritesByComic(2000);
    expect(favorites.count).toBe(1);
  })


  test("returns with count of 0 for nonexistent comic", async() => {
    const favorites = await getFavoritesByComic(9999999);
    expect(favorites.count).toBe(0);
  })


  test("returns with count of 1, favorited=true for comic with correct user", async () => {
    const favorites = await getFavoritesByComic(2000, testUser.id);
    expect(favorites.count).toBe(1);
    expect(favorites.favorited).toBe(true);
  })


  test("returns with count of 1, favorited=false for comic with wrong user", async () => {
    const favorites = await getFavoritesByComic(2000, badUser.id);
    expect(favorites.count).toBe(1);
    expect(favorites.favorited).toBe(false);
  })

})



describe("retrieves favorites by user", function() {

  // make sure the like exists from testUser on comic 2000
  beforeAll(async () => {
    try {
      await addFavorite(testUser.id, 2000);
    } catch(e) {
      if (e.message !== "Cannot favorite as requested, comic already favorited") {
        throw e;
      }
    }
  })

  test("checking testUser will return an array including 2000", async () => {
    const favorites = await getFavoritesByUser(testUser.id);
    expect(favorites).toBeInstanceOf(Array);
    expect(favorites.length).toBe(1);
    expect(favorites[0]).toBe(2000);
  })


  test("checking badUser will return an empty array", async () => {
    const favorites = await getFavoritesByUser(badUser.id);
    expect(favorites).toBeInstanceOf(Array);
    expect(favorites.length).toBe(0);
  })


  test("checking nonexistent user will return an empty array", async () => {
    const favorites = await getFavoritesByUser("fake-user-id-string");
    expect(favorites).toBeInstanceOf(Array);
    expect(favorites.length).toBe(0);
  })

})