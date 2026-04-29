// =============================================
// PROFILE ROUTES
// Syllabus: Routing, Route Parameters, Router-level Middleware
// =============================================
// These routes handle profile operations.
// Multer is used for file upload (Third-party middleware).

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  updateProfile,
  getMyProfile,
  getProfileById,
  searchProfiles,
  getAllProfiles,
  toggleFavourite,
  getFavourites,
  reportProfile,
  adminGetAllUsers,
  adminApproveProfile,
  adminDeleteUser,
  adminGetReported,
  getCompatibleProfiles,
} = require('../controllers/profileController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// =============================================
// MULTER CONFIGURATION (File Upload)
// Syllabus: Third-party Middleware, File Handling
// =============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files go to uploads/ folder
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId-timestamp.extension
    const uniqueName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Only allow image files
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// =============================================
// USER ROUTES (Protected - need login)
// =============================================

// GET /api/profile/search - Search profiles with filters
router.get('/search', protect, searchProfiles);

// GET /api/profile/compatible - Get profiles sorted by compatibility
router.get('/compatible', protect, getCompatibleProfiles);

// GET /api/profile/favourites - Get my favourite profiles
router.get('/favourites', protect, getFavourites);

// GET /api/profile/me - Get my own profile
router.get('/me', protect, getMyProfile);

// PUT /api/profile - Update/Create profile (with photo upload)
router.put('/', protect, upload.single('photo'), updateProfile);

// GET /api/profile - Get all approved profiles
router.get('/', protect, getAllProfiles);

// PUT /api/profile/favourite/:id - Toggle favourite
router.put('/favourite/:id', protect, toggleFavourite);

// PUT /api/profile/report/:id - Report a profile
router.put('/report/:id', protect, reportProfile);

// GET /api/profile/:id - Get profile by ID (Route Parameter demo)
router.get('/:id', protect, getProfileById);

// =============================================
// ADMIN ROUTES (Protected + Admin Only)
// =============================================

// GET /api/profile/admin/users - Get all users
router.get('/admin/users', protect, adminOnly, adminGetAllUsers);

// GET /api/profile/admin/reported - Get reported profiles
router.get('/admin/reported', protect, adminOnly, adminGetReported);

// PUT /api/profile/admin/approve/:id - Approve profile
router.put('/admin/approve/:id', protect, adminOnly, adminApproveProfile);

// DELETE /api/profile/admin/user/:id - Delete user
router.delete('/admin/user/:id', protect, adminOnly, adminDeleteUser);

module.exports = router;
