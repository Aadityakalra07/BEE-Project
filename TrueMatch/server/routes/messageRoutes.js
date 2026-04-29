// =============================================
// MESSAGE ROUTES
// =============================================
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} = require('../controllers/messageController');

// GET /api/messages/unread/count - Get unread message count
router.get('/unread/count', protect, getUnreadCount);

// GET /api/messages/conversations - List all conversations
router.get('/conversations', protect, getConversations);

// GET /api/messages/:userId - Get messages with a user
router.get('/:userId', protect, getMessages);

// POST /api/messages/:userId - Send message to a user
router.post('/:userId', protect, sendMessage);

module.exports = router;
