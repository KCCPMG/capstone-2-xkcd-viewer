# Capstone 2 Proposal - XKCD Viewer

This app would primarily revolve around the use of the [XKCD Interface](https://xkcd.com/json.html) to serve XKCD comics to users, who would then be able to save their favorites, browse, and upvote their favorite for others to see. Ideally, this would also grant the ability to search by number, date, title, and text.


## Tech Stack, Focus

This tech stack would feature Node/Express on the backend (using PostgreSQL) with a React frontend. My expectation is that the design would generally be balanced between backend and frontend, with the backend possiibly requiring slightly more time due to the retrieval of all comics from xkcd to enable added search functionality. This will be designed as a browser app, but will employ bootstrap to try to make the app readable on mobile as well.

## Data and Population

The xkcd api is fairly straightforward, with only one endpoint, which is with the variable of the comic to retrieve. The json returned fits the following pattern:
```
	month: number as string,
	num: number, // the id of the comic
	link: string,
	year: number as string,
	news: string,
	safe_title: string,
	transcript: string, // text, including description of comic, with individual panels surrounded with double brackets
	alt: string,
	img: string // location of png file of comic
	title: string,
	day: number as string
```

I plan to download this data for all comics (currently around 2,700) so as to make the data accessible to being searched. This data will be used to populate an SQL database (using PostgreSQL) that the backend will use to serve content. I do not currently plan on downloading the actual images, but that may be worth future consideration if there is ever concern that the site itself may go down or delete archived content.

The site will also retain some basic user data to handle logins, and will also include tables for user upvotes and user favorites.

The basic outline of steps that I am planning to take is as follows:

1. Write a script to hit all existing API endpoints and populate the database
2. Create a backend that will serve the JSON from the database
3. Add database functionality for users, create backend functionality for signing up and logging in
4. Create React frontend to allow users to retreive comics, sign up, and log in
5. Create database tables for favorites
6. Create backend api endpoints to create, delete, and retrieve favorites
7. Update backend endpoint to retrieve personally favorited status of a comic
8. Add front end ability to interact with favorites api endpoints
9. Create database tables for upvotes
10. Create backend api endpoints to upvote, and to remove an upvote
11. Update backend endpoint for retrieving upvotes as part of getting a comic
12. Add frontend upvote functionality
13. Add backend search api (stretch)
14. Add frontend search ability (stretch)

