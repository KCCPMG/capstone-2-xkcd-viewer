const db = require("../db.js");
const { signup } = require("./User");
const { getComicDetails, getFirstComicDetails, getLastComicDetails, getRandomComicDetails } = require("./Controls");
const { addUpvote, removeUpvote } = require('./Upvote');
const { addFavorite, removeFavorite } = require('./Favorite');
process.env.NODE_ENV = "test";


const testUser = {}
const badUser = {}

beforeAll(async() => {
  await Promise.all([
    db.query(`DELETE FROM upvotes`),
    db.query(`DELETE FROM favorites`), 
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
afterAll(async () => await db.end());

const basic2000 = {
  num: 2000,
  month: '5',
  link: '',
  year: '2018',
  news: '',
  safe_title: 'xkcd Phone 2000',
  transcript: '',
  alt: 'Our retina display features hundreds of pixels per inch in the central fovea region.',
  img: 'https://imgs.xkcd.com/comics/xkcd_phone_2000.png',
  title: 'xkcd Phone 2000',
  day: '30',
  upvoteCount: 0,
  favoriteCount: 0,
  prev: 1999,
  subsequent: 2001
}


describe("Testing getComicDetails", function() {

  test("Correctly collects comic (no userId, no upvotes or favorites)", async () => {
    const details = await getComicDetails(2000);
    expect(details).toEqual(basic2000);
  })

  test("Correctly collects comic (bad userId, no upvotes or favorites)", async () => {
    const details = await getComicDetails(2000, "fake-user-id-string");
    expect(details).toEqual(Object.assign({}, basic2000, {
      upvoted: false,
      favorited: false
    }));
  })

  test("Correctly collects comic after upvote", async () => {
    await addUpvote(testUser.id, 2000);
    
    // for no user
    const details = await getComicDetails(2000);
    expect(details).toEqual(Object.assign({}, basic2000, {upvoteCount: 1}))
    
    // for user who liked
    const detailsForTestUser = await getComicDetails(2000, testUser.id);
    expect(detailsForTestUser).toEqual(Object.assign({}, basic2000, {
      upvoteCount: 1,
      upvoted: true,
      favorited: false
    }))

    // for different user
    const detailsForBadUser = await getComicDetails(2000, badUser.id);
    expect(detailsForBadUser).toEqual(Object.assign({}, basic2000, {
      upvoteCount: 1,
      upvoted: false,
      favorited: false
    }))

    // cleanup
    await removeUpvote(testUser.id, 2000);
  })


  test("Correctly collects comic after favorite", async () => {
    await addFavorite(testUser.id, 2000);
    
    // for no user
    const details = await getComicDetails(2000);
    expect(details).toEqual(Object.assign({}, basic2000, {favoriteCount: 1}))
    
    // for user who favorited
    const detailsForTestUser = await getComicDetails(2000, testUser.id);
    expect(detailsForTestUser).toEqual(Object.assign({}, basic2000, {
      favoriteCount: 1,
      upvoted: false,
      favorited: true
    }))

    // for different user
    const detailsForBadUser = await getComicDetails(2000, badUser.id);
    expect(detailsForBadUser).toEqual(Object.assign({}, basic2000, {
      favoriteCount: 1,
      upvoted: false,
      favorited: false
    }))

    // cleanup
    await removeFavorite(testUser.id, 2000);
  })

})


describe("getFirstComicDetails", function() {
  
  test("getFirstComicDetails returns first comic", async function() {
    const comic = await getFirstComicDetails();
    expect(comic.num).toBe(1);
    expect(comic.prev).toBe(null);
    expect(comic.subsequent).toBe(2);
  })
})


describe("getLastComicDetails", function() {

  test("getLastComicDetails returns last comic", async function() {
    const comic = await getLastComicDetails();
    expect(comic.num).toBe(2707);
    expect(comic.prev).toBe(2706);
    expect(comic.subsequent).toBe(null);
  })
})


describe("getRandomComicDetails", function() {
  
  test("getRandomComicDetails returns random comic", async function(){
    const comic = await getRandomComicDetails();
    expect(comic).toHaveProperty('month');
    expect(comic).toHaveProperty('num');
    expect(comic).toHaveProperty('link');
    expect(comic).toHaveProperty('year');
    expect(comic).toHaveProperty('news');
    expect(comic).toHaveProperty('safe_title');
    expect(comic).toHaveProperty('transcript');
    expect(comic).toHaveProperty('alt');
    expect(comic).toHaveProperty('img');
    expect(comic).toHaveProperty('title');
    expect(comic).toHaveProperty('day');
  })
})