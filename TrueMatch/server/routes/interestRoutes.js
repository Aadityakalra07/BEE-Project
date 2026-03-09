// =============================================
// INTEREST ROUTES
// Syllabus: Routing, Route Parameters
// =============================================
// These routes handle interest requests between users

const express = require('express');
const router = express.Router();

const {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  updateInterestStatus,
} = require('../controllers/interestController');

const { protect } = require('../middleware/authMiddleware');

// All interest routes are protected (require login)

// GET /api/interest/received - Get interests received by me
router.get('/received', protect, getReceivedInterests);

// GET /api/interest/sent - Get interests I sent
router.get('/sent', protect, getSentInterests);

// POST /api/interest/:receiverId - Send interest to someone
router.post('/:receiverId', protect, sendInterest);

// PUT /api/interest/:interestId - Accept or reject interest
router.put('/:interestId', protect, updateInterestStatus);

module.exports = router;
