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

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded); // Debugging step

      // Correctly fetch the user using the appropriate field
      req.user = await User.findById(decoded.id || decoded.userId).select('-password');
      console.log("Fetched user:", req.user); // Debugging step

      // Check if the user exists
      if (!req.user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the user's email is verified
      if (!req.user.isVerified) {
        return res.status(403).json({ error: 'User email not verified' });
      }

      next();
    } catch (error) {
      console.error('Token validation error:', error);

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
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

module.exports = { protect };
