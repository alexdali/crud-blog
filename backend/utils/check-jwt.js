const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.APP_SECRET;

// Verify Token
 const verifyToken = async (req, res, next) => {
  // deconstructed token from request headers
  const { token } = req.headers;
  console.log(`verifyToken req.headers: ${JSON.stringify(req.headers)}`);
  // if token is not exist
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not provided",
    });
  }
  try {
    // if the token is valid extract the user ID from the token
    const decoded =  jwt.verify(token, secret);
    console.log(`verifyToken decoded: ${JSON.stringify(decoded)}`);
    // put the user onto the req for future requests
    req.userId = decoded.userId;
    console.log(`verifyToken req.userId: ${JSON.stringify(req.userId)}`);

    next();
  } catch (error) {
    return res.status(401).send('Authentication Failed');
  }
};

module.exports = verifyToken;