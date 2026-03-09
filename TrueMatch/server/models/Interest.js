// =============================================
// INTEREST MODEL (MongoDB Schema)
// Syllabus: Modules, NPM, Mongoose
// =============================================
// This model tracks interest requests between users.
// When User A sends interest to User B, a new Interest
// document is created with status "pending".

const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  // Who sent the interest request
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Who received the interest request
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Current status of the request
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },

  // When the interest was sent
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Interest', interestSchema);
