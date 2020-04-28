'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require('./routes');

// initialize server app
const app = express();

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

// try {
//   await app.listen(PORT);
//   console.log(`Server running at: ${server.info.uri}`);
// } catch(err) { //
//   console.log(JSON.stringify(err));
// }
