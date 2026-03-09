// =============================================
// AUTH ROUTES
// Syllabus: Routing, Route Methods, Route Paths
// =============================================
// These routes handle authentication (register, login, get profile)
// We use express.Router() for modular, router-level routing

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register - Register new user
router.post('/register', registerUser);

// POST /api/auth/login - Login user
router.post('/login', loginUser);

// GET /api/auth/me - Get current user (Protected route)
router.get('/me', protect, getMe);

module.exports = router;
