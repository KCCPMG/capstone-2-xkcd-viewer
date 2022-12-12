
## December 4, 2022, 3:30 PM

My first step needs to be to populate my database. The first thing that I need to do is create the sql database that I will use, which I will name "xkcd". I will then create a table called "comics", but in order to successfully populate it, I need to know the full range of possible keys that come back in the JSON. This means that I need to scrape all possible endpoints to create a JSON object that I can analyze.

Next, I need to write a node script which uses axios and includes the following:
- A function that sends a get request to a given endpoint
- A function that writes the results of a request to a JSON file
- A function that implements the prior two functions to populate the JSON file

Once this is done, I will take a closer look at the JSON to create my schema for the "comics" table.

## December 9, 9:10 AM

I've downloaded all of the comic metadata from #1 up to comic #2707. First of all, I've found that I have all of the comics except for #404, which does not exist (even on the xkcd site, comic 404 is just their 404 page). Playing around with the data a bit further, I've found that all responses have the following schema:

"month" string 
"num" number 
"link" string 
"year" string 
"news" string 
"safe_title" string 
"transcript" string 
"alt" string 
"img" string 
"title" string 
"day" string 

The only outlier is that there are twenty comics which have an "extra_parts" key, which contains some object. These mostly seem to contain script elements that are meant to be used on the comic (making certain parts clickable, a comic with a table of .gif images that allows for a basic animation). Not all extra_parts objects have the same keys, but they all have one or more of the following: 'pre', 'headerextra', 'post', 'imgAttr', 'inset', 'links'.

These seem to be basic scripts that I can simply drop in when showing the images myself, but I won't cross that bridge for a while. In the meantime, there are so few of these (and in something of a messy pattern) that I will not include them as part of my main comics table. They may go into another SQL table, or I may store them somewhere else, or I may avoid them altogether if it proves that it is too complicated to represent these when there are other things that need to be done. These special cases are only 20 out of over 2,700 comics.

Meanwhile, it seems like I can begin putting together my comics table clearly from the JSON that I'm getting back.


## December 9, 1:40 PM

My visualized database should look like this:

![Database Diagram](./seed/database_diagram.jpg)

I now need to review express-jobly and perhaps other projects to see how to corretly model and seed this with pg and sql.


## December 10, 12:55 PM

Though I have some cleanup to do, I have set up my config.js file, my db.js file, and my seed.js file to seed my test database. My next step will be to set up my models with the following methods

Comic
-getComic
-addComic

User
-getUser
-signup
-authenticate
-editUser

Upvote
-addUpvote
-removeUpvote

Favorite
-addFavorite
-removeFavorite


## December 10, 3:00 PM

I've completed Comic.js for now, as well as Comic.test.js with all tests passing. There may be more changes I make to these later, but otherwise I will go ahead with the remaining models, writing tests as I go.


## December 10, 4:00 PM

I've added some errors while working on User, and I will also need to use those errors for some cases in Comic.js and Comic.test.js that are currently only returning strings for not being found. This will give me a more straightforward way of handling errors when it comes time to handle the actual routing. Additionally, I am using uuid to generate user ids, which means I need to change my User schema so that ids are held as text instead of as integers. This means I will also need to correct my upvotes and favorites tables to reflect that the foreign key in users is text and not an integer.


## December 11, 10:15 AM

I realized that I needed to make another correction to my database setup, which is to make 'username' UNIQUE on the users table. This means that a user will now have three unique identifiers, although username and email may be subject to change.


## December 11, 1:05 PM

Made additional changes to Comic.js and Comic.test.js to better handle errors and to catch them in the test where I was not accurately doing so before.


## December 11, 5:15 PM

I had a great deal of difficulty getting User.signup working, but it appears to finally be working correctly. I need to be more careful with my db queries, because bad arguments throw errors that don't provide a tremendous amount of detail. I also learned that I should change my created_at in users from a DATE to a TIMESTAMPTZ, which I can populate by using NOW() in the db query string (not the array).


## December 11, 6:20 PM

I still have the favorites and upvotes models to do, but I want to move ahead slightly and take care of the basic scaffolding for the backend so that I can start serving some of the comics. I may also need to add a more detailed version of getComic to Comic.js which will return upvotes and favorites along with the data from the comics table.

## December 11, 8:30 PM

In order to fill in some of the scaffolding, I need to write my middleware auth token. I am expecting the auth token to simply be in req.header.token, and I will not require it to be preceded by "Bearer" or any other decorator. If jwt successfully verifies a token, the user id will go to req.user_id. req.user_id will be set to null before making this check, so as to prevent a request from being manipulated to give it a user_id separately from the jwt verification process.












