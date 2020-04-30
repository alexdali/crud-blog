//const express = require("express");
//router = express.Router();
const userController = require("../controllers/UserController");
const postController = require("../controllers/PostController");
//const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/check-jwt");

require('dotenv').config();

module.exports = (app) => {

  app.get("/", (req, res) => {
    res.json({message: "welcome to Home"});
  })

  // users Routes
  app.get("/api/user/list", userController.getAllUsers);

  app.post("/api/user/register", userController.register);

  app.post("/api/user/login", userController.login);

  app.get("/api/user/:userId",  verifyToken, userController.getUserById);

  // posts Routes
  app.get("/api/posts/count",  postController.countAllPosts);

  app.get("/api/posts/list",  postController.recentPageOfPosts);

  app.get("/api/posts/list/:page",  postController.PageOfPosts);

  app.get("/api/:userId/posts",  postController.getAllPostsOfUser);

  app.post("/api/post/new",  verifyToken, postController.createPost);

  app.post("/api/post/update",  verifyToken, postController.updatePost);

  app.post("/api/post/delete",  verifyToken, postController.deletePost);

}