
## December 4, 2022, 3:30 PM

My first step needs to be to populate my database. The first thing that I need to do is create the sql database that I will use, which I will name "xkcd". I will then create a table called "comics", but in order to successfully populate it, I need to know the full range of possible keys that come back in the JSON. This means that I need to scrape all possible endpoints to create a JSON object that I can analyze.

Next, I need to write a node script which uses axios and includes the following:
- A function that sends a get request to a given endpoint
- A function that writes the results of a request to a JSON file
- A function that implements the prior two functions to populate the JSON file

Once this is done, I will take a closer look at the JSON to create my schema for the "comics" table.

