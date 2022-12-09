
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