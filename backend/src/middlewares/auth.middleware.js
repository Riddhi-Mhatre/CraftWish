const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const env = require('../config/env');

// Middleware 1: Ensure the user is logged in
const protect = async (req, res, next) => {
  let token;

  // Check if the request headers contain a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (format is "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using our secret key
      const decoded = jwt.verify(token, env.jwtSecret);

      // Find the user in the database and attach them to the request object (excluding their password)
      req.user = await User.findById(decoded.id).select('-password');

      // Move to the next middleware
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  // If no token was found at all
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Middleware 2: Ensure the logged-in user is an Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // They are an admin, let them through
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden: You must be an admin to perform this action' });
  }
};

module.exports = { protect, admin };