const User = require("../db/models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const status = require("../utils/status");

require('dotenv').config();
const secret = process.env.APP_SECRET;

module.exports = {

  // function to sign in the user
  async login(req, res) {
    try {
      // deconstructed email & password from request body
      const { email, password } = req.body;
      // check if there is a user with that email
      const userCollection = await User.findAll({
        where: {email: email},
      });
      // if email does not exist
      if(userCollection.length == 0) {
        return res.status(400).send(`User with email: ${email} does not exist`);
      }

      console.log(`login userCollection: ${JSON.stringify(userCollection)} `);
      // check if password is correct
      const user = userCollection[0].dataValues;
      const valid = await bcrypt.compare(password, user.password.trim());
      // if password is not correct
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password'
        });
      }
      // if password is correct, generated the JWT token
      const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: '1d'
      });
      // return user.id & token to the client
      return res.status(200).json({
        success: true,
        userId: user.id,
        message: "Login successful. Token generated successfully.",
        token: token
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function to sign up a new user
  async register(req, res) {
    try {
      console.log(`register req.body: ${JSON.stringify(req.body)} `);
      // deconstructed email & name from request body
      const { email, name } = req.body;

      // check if email isn't exist in database
      const userCollection = await User.findAll({
        where: {email: email}
      });
      // if email already exists in database
      if(userCollection.length > 0) {
        return res.status(203).json({
          success: false,
          message: "User with that email already exist"
        });
      }
      // if email is not exist in database
      if(userCollection == 0) {
        // hash password
        const password = await bcrypt.hash(req.body.password, 10);
        // create the user in the database
        const newUser = await User.create(
          {email, password, name},
        );
        console.log(`register newUser: ${JSON.stringify(newUser)} `);

        // generated the JWT token
        const token = jwt.sign({ userId: newUser.id }, secret, {
          expiresIn: '1d'
        });
        // create new User object without password
        const userNoPassword = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          updatedAt: newUser.updatedAt,
          createdAt: newUser.updatedAt
        };
        console.log(`register userNoPassword: ${JSON.stringify(userNoPassword)} `);
        // return new user & token to the client
        return res.status(201).json({
          success: true,
          user: userNoPassword,
          message: "New login created. Token generated successfully.",
          token: token
        });

      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function to request all users
  async getAllUsers(req, res) {
    try {
      // get all users from the database
      const userCollection = await User.findAll();
      console.log(`getAllUsers userCollection: ${JSON.stringify(userCollection)} `);
      // if the request was returned empty from database
      if(userCollection.length == 0) {
        return res.status(404).json(
          status.error404
        );
      }
      // select only certain user attributes
      const usersArr = userCollection.map(el => {return  { name: el.name, id: el.id }}
      );
      console.log(`getAllUsers usersArr: ${JSON.stringify(usersArr)} `);
      // return array of all users to the client
      return res.status(200).json({
        success: true,
        users: usersArr
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },

  // function to request the user by id
  async getUserById(req, res) {
    try {
      console.log(`getUserById req.params: ${JSON.stringify(req.params)} `);
      // deconstructed userId from request params
      const {userId} = req.params;
      // request for user record by id without "password" attribute"
      const user = await User.findByPk(
        userId, { attributes: { exclude: ['password'] } }
      );
      console.log(`getUserById user: ${JSON.stringify(user)} `);
      // if the request was returned empty from database
      if(!user) {
        return res.status(404).json(
          status.error404
        );
      }
      // if the request was successful return user to the client
      return res.status(200).json({
        success: true,
        user: user
      });

    } catch (e) {
      console.log(e);
      return res.status(500).json(
        status.error500
      );
    }
  },
}