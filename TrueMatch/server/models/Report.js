// =============================================
// REPORT MODEL (MongoDB Schema)
// =============================================
// Tracks who reported whom and why.
// Replaces the simple isReported boolean flag.

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  // Who filed the report
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Who is being reported
  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Reason for reporting
  reason: {
    type: String,
    enum: ['fake_profile', 'inappropriate_content', 'harassment', 'spam', 'other'],
    required: [true, 'Report reason is required'],
  },

  // Additional details
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: '',
  },

  // Report status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent same user from reporting same person more than once
reportSchema.index({ reporter: 1, reportedUser: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
