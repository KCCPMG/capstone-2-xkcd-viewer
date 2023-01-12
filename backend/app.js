const express = require('express');
const cors = require('cors');
const { NotFoundError } = require('./expressError');
const authenticateJWT = require('./middleware/auth');

const comicsRouter = require('./routes/comics');
const authRouter = require('./routes/auth');

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

// app.use routes here
app.use('/comics', comicsRouter);
app.use('/auth', authRouter);


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





module.exports = app;