// =============================================
// USER MODEL (MongoDB Schema using Mongoose)
// Syllabus: Modules, NPM, File dependency
// =============================================
// This model defines what a User document looks like
// in our MongoDB database. Each field has a type and
// validation rules.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },

  // Email for login (must be unique)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  // Hashed password (never store plain text!)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },

  // Gender
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required'],
  },

  // Age
  age: {
    type: Number,
    min: 18,
    max: 100,
  },

  // Religion
  religion: {
    type: String,
    trim: true,
  },

  // Caste
  caste: {
    type: String,
    trim: true,
  },

  // Profession / Job
  profession: {
    type: String,
    trim: true,
  },

  // Education level
  education: {
    type: String,
    trim: true,
  },

  // City
  city: {
    type: String,
    trim: true,
  },

  // Short bio / about me
  bio: {
    type: String,
    maxlength: 500,
  },

  // Profile photo filename (uploaded via Multer)
  photo: {
    type: String,
    default: '',
  },

  // Admin approval status
  isApproved: {
    type: Boolean,
    default: false,
  },

  // Is this user an admin?
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  // Is profile complete? (has all details filled)
  isProfileComplete: {
    type: Boolean,
    default: false,
  },

  // Is this profile reported by someone?
  isReported: {
    type: Boolean,
    default: false,
  },

  // Favourites - array of user IDs
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  // Account creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model so other files can use it
module.exports = mongoose.model('User', userSchema);
