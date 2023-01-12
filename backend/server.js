if (process.argv.includes("--TESTMODE")) {
  process.env.NODE_ENV="test";
} else {
  process.env.NODE_ENV="production";
}
console.log(process.env.NODE_ENV)

const app = require('./app');
const { PORT } = require("./config");

app.listen(PORT, function() {
  console.log(`Listening on port ${PORT}`)
})