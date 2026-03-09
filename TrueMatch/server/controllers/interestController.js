// =============================================
// INTEREST CONTROLLER
// Syllabus: Route Handlers, Response Methods
// =============================================
// Handles sending, accepting, rejecting interest requests

const Interest = require('../models/Interest');

// =============================================
// @desc    Send interest to another user
// @route   POST /api/interest/:receiverId
// @access  Private
// =============================================
const sendInterest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    // Can't send interest to yourself
    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "You can't send interest to yourself" });
    }

    // Check if interest already exists
    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingInterest) {
      return res.status(400).json({ message: 'Interest already sent to this user' });
    }

    // Create new interest
    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({ message: 'Interest sent successfully', interest });
  } catch (error) {
    res.status(500).json({ message: 'Error sending interest', error: error.message });
  }
};

// =============================================
// @desc    Get received interests
// @route   GET /api/interest/received
// @access  Private
// =============================================
const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ receiver: req.user._id })
      .populate('sender', 'name age city profession photo religion')
      .sort({ createdAt: -1 });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interests', error: error.message });
  }
};

// =============================================
// @desc    Get sent interests
// @route   GET /api/interest/sent
// @access  Private
// =============================================
const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ sender: req.user._id })
      .populate('receiver', 'name age city profession photo religion')
      .sort({ createdAt: -1 });

    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent interests', error: error.message });
  }
};

// =============================================
// @desc    Accept or Reject an interest
// @route   PUT /api/interest/:interestId
// @access  Private
// =============================================
const updateInterestStatus = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "rejected"

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const interest = await Interest.findById(req.params.interestId);

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    // Only the receiver can accept/reject
    if (interest.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this interest' });
    }

    interest.status = status;
    await interest.save();

    res.json({ message: `Interest ${status}`, interest });
  } catch (error) {
    res.status(500).json({ message: 'Error updating interest', error: error.message });
  }
};

module.exports = {
  sendInterest,
  getReceivedInterests,
  getSentInterests,
  updateInterestStatus,
};
