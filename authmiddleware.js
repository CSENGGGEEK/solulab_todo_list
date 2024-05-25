// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const { secretKey } = require('./config'); 

const authMiddleware = (req, res, next) => {
  // Extract the token from the request headers
  const token = req.header('x-auth-token');

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Attach the user information to the request object
    req.user = decoded.user;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Invalid token
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;