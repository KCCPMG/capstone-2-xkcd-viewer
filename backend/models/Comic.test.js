const db = require("../db.js");
const {getComic, addComic} = require("./Comic.js");
process.env.NODE_ENV = "test";

beforeAll(async() => await db.query(`DELETE FROM comics WHERE num=2709;`));
afterAll(async () => await db.end());


describe("Testing Comic.js", function() {
  test("Should not fail", function(){
    expect(2).toBe(2);
  })

  test("Should return a valid comic when there is one", async function(){
    const comic = await getComic(1);
    expect(comic.num).toBe(1);
    expect(comic.year).toBe("2006");
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
    expect(comic).toStrictEqual(newComic);

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

    // try {
    //   const addResults = await addComic(newComic);
    // } catch(e) {
    //   expect(e.status).toBe(4000);
    // }
  })

})