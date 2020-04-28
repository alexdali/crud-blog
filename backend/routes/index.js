//const express = require("express");
//router = express.Router();

module.exports = (app) => {
//export default (app) => {

  app.get("/", (req, res) => {
    res.json({message: "test 2 welcome"});
  })

}



//module.exports = router;