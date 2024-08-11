// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   let token;
  
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
//       req.user = await User.findById(decoded.userId).select('-password');
//       next();
//     } catch (error) {
//       console.error('Token verification failed:', error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// };

// module.exports = { protect };

const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header contains a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded); // Debugging: Log the decoded token

      // Find the user by the decoded ID
      req.user = await User.findById(decoded.id).select('-password');
      console.log("Fetched user:", req.user); // Debugging: Log the user details

      // Check if the user exists in the database
      if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user's email is verified
      if (!req.user.isVerified) {
        return res.status(403).json({ error: 'User email not verified' });
      }

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Token validation error:', error); // Log the error for debugging

      // Handle specific JWT errors
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired, please login again' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(401).json({ error: 'Not authorized, token failed' });
      }
    }
  } else {
    // If no token is provided in the header
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
