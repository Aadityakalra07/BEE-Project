// =============================================
// AUTHENTICATION MIDDLEWARE
// Syllabus: Application-level Middleware, JWT
// =============================================
// This middleware checks if the user is logged in
// by verifying the JWT token sent in the request header.
// If valid, it attaches user info to req.user.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - only logged-in users can access
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  // Format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      // Move to next middleware/route handler
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin-only middleware
// Must be used AFTER protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, adminOnly };
