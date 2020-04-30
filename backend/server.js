'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require('./routes');
const db = require("./db/models");

// initialize server app
const app = express();

// test connection db
(async () => {
  try {
    await db.sequelize.authenticate();

    console.log("db connected");
  } catch(err) { // if error
    console.error(`Connection db error: ${JSON.stringify(err)}`);
  }
 })();

 //Sync Database
(async () => {
  try {
    // {force: true} will drop the table if it already exists
    await  db.sequelize.sync({force: false});

    console.log("db sync");
  } catch(err) { // if error
    console.error(`DB sync Error: ${JSON.stringify(err)}`);
  }
 })();

// set cors rules
const corsOptions = {
  origin: "http://localhost:8081"
};

// use cors
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

routes(app);

// set port
const PORT = process.env.PORT || 8080;

// listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});