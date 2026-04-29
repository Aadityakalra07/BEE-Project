const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['photo', 'id'],
    required: true,
  },
  // For photo: selfie image. For id: government ID image.
  documentPath: {
    type: String,
    required: true,
  },
  // Random code user must hold in selfie
  verificationCode: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

verificationRequestSchema.index({ user: 1, type: 1 });
verificationRequestSchema.index({ status: 1 });

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);
