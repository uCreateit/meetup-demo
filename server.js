require("newrelic");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require("body-parser");

dotenv.load();

const Rollbar = require("rollbar");
const index = require("./app/routes/index");

const rollbar = new Rollbar(process.env.ROLLBAR_ACCESS_TOKEN);
const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "./app/views"));
app.set("view engine", "hbs");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.get("/", index);

app.get("/error", (req, res) => {
  try {
    throw new Error("something bad happened in test");
  } catch (error) {
    rollbar.error(error);
  }
  res.send("Error posted to rollbar");
});

app.use(rollbar.errorHandler());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
