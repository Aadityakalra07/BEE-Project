// =============================================
// AUTH ROUTES
// Syllabus: Routing, Route Methods, Route Paths
// =============================================
// These routes handle authentication (register, login, get profile)
// We use express.Router() for modular, router-level routing

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, loginUser, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		const uniqueName = `register-${Date.now()}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif|webp/;
	const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = allowedTypes.test(file.mimetype);

	if (extname && mimetype) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max (file upload size limit)
});

// POST /api/auth/register - Register new user (rate limited: 10 req/min)
router.post('/register', authLimiter, upload.single('profilePic'), registerUser);

// POST /api/auth/login - Login user (rate limited: 10 req/min)
router.post('/login', authLimiter, loginUser);

// POST /api/auth/google - Login/Register with Google (rate limited: 10 req/min)
router.post('/google', authLimiter, googleLogin);

// GET /api/auth/me - Get current user (Protected route - no rate limit needed)
router.get('/me', protect, getMe);

module.exports = router;
