process.env.NODE_ENV="test";

const express = require('express');
const cors = require('cors');
const { NotFoundError } = require('./expressError');
const authenticateJWT = require('./middleware/auth');
const { PORT } = require("./config.js");

const comicsRouter = require('./routes/comics');

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// app.use routes here
app.use('/comics', comicsRouter);

// placeholder
app.get("/", (req, res) => {
  res.json("Hello World");
})

/** 404 Handler */
app.use((req, res, next) => {
  return next(new NotFoundError());
})

/** Generic error handler */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status }
  });
})


app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`)
})


// module.exports = app;