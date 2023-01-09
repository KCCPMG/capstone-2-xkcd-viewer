const db = require("../db.js");
const {getComic, getLastComic, getFirstComic, getRandomComic, addComic} = require("./Comic.js");
process.env.NODE_ENV = "test";

beforeAll(async() => await db.query(`DELETE FROM comics WHERE num=2709;`));
afterAll(async () => await db.end());


describe("Testing Comic.js", function() {

  test("Should return a valid comic when there is one", async function(){
    const comic = await getComic(1);
    expect(comic.num).toBe(1);
    expect(comic.year).toBe("2006");
    expect(comic.prev).toBe(null)
    expect(comic.subsequent).toBe(2);
    expect(comic.transcript).toContain(`[[The barrel drifts into the distance. Nothing else can be seen.]]`);
  })


  test("Should throw a BadRequestError when a valid comic cannot be found", async function(){
    await expect(getComic(0)).rejects.toThrow("Could not find this comic, please check your input")
  })

  test("Should successfully add a comic", async function(){
    // this comic is outside of the range of what is initially brought into comics.json and the seeded testdb
    const newComic = {
      month: "12", 
      num: 2709, 
      link: "", 
      year: "2022", 
      news: "", 
      safe_title: "Solar System Model", 
      transcript: "", 
      alt: "The Earth is, on average, located in the habitable zone, but at any given time it has a certain probability of being outside it, hich is why life exists on Earth but is mortal.", 
      img: "https://imgs.xkcd.com/comics/solar_system_model.png", 
      title: "Solar System Model", 
      day: "9"
    }

    const addResults = await addComic(newComic);
    expect(addResults).toStrictEqual(newComic);

    const comic = await getComic(2709);
    // check prev and subsequent as well
    expect(comic).toStrictEqual(Object.assign(newComic, {
      prev: 2707,
      subsequent: null
    }));

    await db.query(`DELETE FROM comics WHERE num=2709;`)
    await expect(getComic(2709)).rejects.toThrow("Could not find this comic, please check your input")
    
  })

  test("Should throw an error if a comic already exists", async function(){
    const newComic = {
      month: "12", 
      num: 1, 
      link: "", 
      year: "2022", 
      news: "", 
      safe_title: "Solar System Model", 
      transcript: "", 
      alt: "The Earth is, on average, located in the habitable zone, but at any given time it has a certain probability of being outside it, hich is why life exists on Earth but is mortal.", 
      img: "https://imgs.xkcd.com/comics/solar_system_model.png", 
      title: "Solar System Model", 
      day: "9"
    }

    await expect(addComic(newComic)).rejects.toThrow("Bad Request: Could not create comic, please check your input")
  })

})


describe("first, last, random comics", function() {

  test("gets first comic", async function() {
    const comic = await getFirstComic();
    expect(comic.num).toBe(1);
    expect(comic.prev).toBe(null);
    expect(comic.subsequent).toBe(2);
  })

  test("gets last comic", async function() {
    const comic = await getLastComic();
    expect(comic.num).toBe(2707);
    expect(comic.prev).toBe(2706);
    expect(comic.subsequent).toBe(null);
  })

  test("gets random comic", async function() {
    const comic = await getRandomComic();
    expect(comic.prev).toBe(comic.num-1);
    expect(comic.subsequent).toBe(comic.num+1);
  })
})