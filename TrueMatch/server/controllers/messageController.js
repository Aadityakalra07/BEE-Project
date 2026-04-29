// =============================================
// MESSAGE CONTROLLER
// =============================================
// Handles conversations and messaging.
// Only users with accepted interests can message.

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Interest = require('../models/Interest');

// ── Helper: Check if two users have an accepted interest ──
const canMessage = async (userId1, userId2) => {
  const interest = await Interest.findOne({
    $or: [
      { sender: userId1, receiver: userId2, status: 'accepted' },
      { sender: userId2, receiver: userId1, status: 'accepted' },
    ],
  });
  return !!interest;
};

// =============================================
// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
// =============================================
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name photo')
      .populate('lastMessageSender', 'name')
      .sort({ updatedAt: -1 });

    // Add unread count for each conversation
    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = conv.participants.find(
          (p) => p._id.toString() !== req.user._id.toString()
        );
        const unreadCount = await Message.countDocuments({
          sender: otherUser?._id,
          receiver: req.user._id,
          read: false,
        });
        return {
          ...conv.toObject(),
          otherUser,
          unreadCount,
        };
      })
    );

    res.json(withUnread);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

// =============================================
// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
// =============================================
const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    // Mark messages from the other user as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, read: false },
      { read: true }
    );

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

// =============================================
// @desc    Send a message to a user
// @route   POST /api/messages/:userId
// @access  Private
// =============================================
const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Check if they have an accepted interest
    const allowed = await canMessage(req.user._id, receiverId);
    if (!allowed) {
      return res.status(403).json({
        message: 'You can only message users with accepted interests',
      });
    }

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text: text.trim(),
    });

    // Update or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, receiverId] },
    });

    if (conversation) {
      conversation.lastMessage = text.trim().substring(0, 100);
      conversation.lastMessageSender = req.user._id;
      conversation.updatedAt = Date.now();
      await conversation.save();
    } else {
      conversation = await Conversation.create({
        participants: [req.user._id, receiverId],
        lastMessage: text.trim().substring(0, 100),
        lastMessageSender: req.user._id,
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// =============================================
// @desc    Get total unread message count
// @route   GET /api/messages/unread/count
// @access  Private
// =============================================
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      read: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unread count', error: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };
