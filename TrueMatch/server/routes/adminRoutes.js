const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  toggleSuspend,
  approveAll,
  exportUsersCSV,
  getVerificationRequests,
  reviewVerification,
} = require('../controllers/adminController');

// GET /api/admin/stats — Dashboard analytics
router.get('/stats', protect, adminOnly, getAdminStats);

// PUT /api/admin/approve-all — Approve all pending
router.put('/approve-all', protect, adminOnly, approveAll);

// PUT /api/admin/suspend/:id — Toggle suspend
router.put('/suspend/:id', protect, adminOnly, toggleSuspend);

// GET /api/admin/export-csv — Export users CSV
router.get('/export-csv', protect, adminOnly, exportUsersCSV);

// GET /api/admin/verification-requests — Pending verifications
router.get('/verification-requests', protect, adminOnly, getVerificationRequests);

// PUT /api/admin/verification/:id — Approve/reject verification
router.put('/verification/:id', protect, adminOnly, reviewVerification);

module.exports = router;
